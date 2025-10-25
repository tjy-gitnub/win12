#!/usr/bin/env bash
set -euo pipefail

# Simple installer for win12-manager (FastAPI)
# Usage: sudo ./scripts/install_server.sh [--target /opt/win12-manager] [--api-key <key>]

TARGET="/opt/win12-manager"
API_KEY="changeme"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)
      TARGET="$2"; shift 2;;
    --api-key)
      API_KEY="$2"; shift 2;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

if [[ $EUID -ne 0 ]]; then
  echo "This installer must be run as root (sudo)"
  exit 1
fi

echo "Installing win12-manager to $TARGET"

# create system user if missing
if ! id -u win12svc >/dev/null 2>&1; then
  useradd --system --no-create-home --home $TARGET --shell /usr/sbin/nologin win12svc || true
fi

# prepare target
if [[ -d "$TARGET" ]]; then
  echo "Target $TARGET exists — creating backup"
  timestamp=$(date +%s)
  mv "$TARGET" "${TARGET}.bak.${timestamp}" || true
fi
mkdir -p "$TARGET"

# copy files (rsync to avoid copying venv if present)
if command -v rsync >/dev/null 2>&1; then
  rsync -a --exclude 'venv' --exclude '__pycache__' ./ "$TARGET/"
else
  cp -a . "$TARGET/"
fi
chown -R win12svc:win12svc "$TARGET"

# Ensure python venv support is installed
if ! python3 -m venv --help >/dev/null 2>&1; then
  echo "python3-venv missing; installing via apt"
  apt update
  apt install -y python3-venv python3-pip
fi

# create python venv and install requirements
python3 -m venv "$TARGET/venv"
"$TARGET/venv/bin/pip" install --upgrade pip
"$TARGET/venv/bin/pip" install -r "$TARGET/server/requirements.txt"

# create audit log file and set ownership
mkdir -p "$TARGET/server"
touch "$TARGET/server/audit.log"
chown win12svc:win12svc "$TARGET/server/audit.log"

# create systemd service file
SERVICE_FILE="/etc/systemd/system/win12-manager.service"
if [[ -f "$SERVICE_FILE" ]]; then
  echo "Backing up existing service file"
  cp "$SERVICE_FILE" "${SERVICE_FILE}.bak.$(date +%s)"
fi
cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=win12 Manager (FastAPI)
After=network.target

[Service]
Type=simple
User=win12svc
Group=win12svc
WorkingDirectory=$TARGET
Environment=WIN12_API_KEY=$API_KEY
ExecStart=$TARGET/venv/bin/uvicorn server.app.main:APP --host 0.0.0.0 --port 8000
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now win12-manager.service || systemctl start win12-manager.service || true

echo "Installation complete. Check: systemctl status win12-manager.service"

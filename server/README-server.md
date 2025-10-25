# win12-manager (FastAPI)

This directory contains a minimal FastAPI-based management server for the Win12 static UI. The server serves the existing repository as static assets and provides a small set of management APIs (update files, restart service, status).

Quick start (for development)

1. Create a venv and install requirements:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r server/requirements.txt
```

2. Run locally (the app will serve files from the repository root by default):

```bash
export WIN12_API_KEY=changeme
uvicorn server.app.main:APP --reload --host 127.0.0.1 --port 8000
```

3. Use the API:

- GET  /api/status
- POST /api/apply-file  (JSON {"path": "apps/foo/index.html", "content": "..."})
- POST /api/restart     (requests systemd to restart the installed service)

Installation (Ubuntu, automated)

Run the installer script from the repository root as root or with sudo:

```bash
sudo bash scripts/install_server.sh --target /opt/win12-manager --api-key "YOUR_SECRET_KEY"
```

This will:
- copy the repository to `/opt/win12-manager`
- create a system user `win12svc`
- create a Python virtualenv and install dependencies
- create and enable a `win12-manager.service` systemd unit

Security notes

- The API uses a single API key (environment variable `WIN12_API_KEY`) — change it to a strong secret.
- The `/api/apply-file` endpoint is restricted to a small whitelist of top-level directories to reduce risk. Do not expose this service publicly without a reverse proxy with TLS and additional authentication.
- The `restart` endpoint calls `systemctl restart` and therefore requires the systemd unit to be installed.

Next steps (suggestions)

- Add rate-limiting and better logging.
- Add an audit log of changes (who/when/what).
- Provide a `git pull` endpoint that only runs in a controlled way and on a whitelisted branch.
- Containerize with Docker for easier deployment.

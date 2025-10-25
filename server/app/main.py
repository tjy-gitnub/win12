import os
import time
import subprocess
import shutil
import logging
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, Request, Depends, Header
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

START_TIME = time.time()
APP = FastAPI(title="win12-manager")

# logging
LOG = logging.getLogger("win12-manager")
LOG.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
LOG.addHandler(handler)

# Determine repository root (two levels above this file: server/app -> server -> repo root)
THIS_FILE = Path(__file__).resolve()
REPO_ROOT = THIS_FILE.parents[2]

# Static files served from repo root by default. Can be overridden with STATIC_DIR env var.
STATIC_DIR = Path(os.environ.get("STATIC_DIR", str(REPO_ROOT)))

# Simple API key auth
API_KEY = os.environ.get("WIN12_API_KEY", "changeme")

# White-listed top-level folders that may be written by the API
ALLOWED_TOP_DIRS = {"apps", "scripts", "style", "module", "data", "img", "media", "pwa", "fonts", "icon"}

# audit log file inside server directory
AUDIT_LOG = REPO_ROOT / "server" / "audit.log"

# content size limit
MAX_CONTENT_BYTES = int(os.environ.get("WIN12_MAX_CONTENT_BYTES", str(1 * 1024 * 1024)))  # 1MB default

# rate limiting (per API key)
RATE_LIMIT_REQUESTS = int(os.environ.get("WIN12_RATE_LIMIT_REQS", "60"))
RATE_LIMIT_WINDOW = int(os.environ.get("WIN12_RATE_LIMIT_WINDOW", "60"))
_rate_counters = {}

def _rate_allow(key: str) -> bool:
    now = int(time.time())
    window_start = now - (now % RATE_LIMIT_WINDOW)
    counts = _rate_counters.setdefault(key, {})
    if counts.get("window") != window_start:
        counts.clear()
        counts["window"] = window_start
        counts["count"] = 0
    if counts["count"] >= RATE_LIMIT_REQUESTS:
        return False
    counts["count"] += 1
    return True


def require_api_key(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")
    token = authorization.split(" ", 1)[1]
    if token != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    # rate-limit per API key
    if not _rate_allow(token):
        raise HTTPException(status_code=429, detail="Rate limit exceeded")


def is_safe_path(base: Path, target: Path) -> bool:
    try:
        base_resolved = base.resolve()
        target_resolved = target.resolve()
    except Exception:
        return False
    return str(target_resolved).startswith(str(base_resolved))


@APP.on_event("startup")
def _startup():
    # mount static files dynamically on startup
    if STATIC_DIR.exists():
        APP.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")
    # ensure audit log exists
    try:
        AUDIT_LOG.parent.mkdir(parents=True, exist_ok=True)
        if not AUDIT_LOG.exists():
            AUDIT_LOG.write_text("# audit log\n", encoding="utf-8")
    except Exception:
        LOG.exception("Failed to create audit log")


@APP.get("/api/status")
def status():
    return {
        "status": "ok",
        "uptime_seconds": int(time.time() - START_TIME),
        "pid": os.getpid(),
        "static_dir": str(STATIC_DIR),
    }


@APP.post("/api/apply-file")
def apply_file(payload: dict, auth=Depends(require_api_key)):
    """Apply or create a file inside the repository.

    payload JSON fields:
    - path: relative path inside repo (e.g. "apps/myapp/index.html")
    - content: string contents to write
    """
    path = payload.get("path")
    content = payload.get("content")
    if not path or content is None:
        raise HTTPException(status_code=400, detail="Both 'path' and 'content' are required")

    # prevent absolute paths and traversal
    rel_path = Path(path)
    if rel_path.is_absolute():
        raise HTTPException(status_code=400, detail="Absolute paths are not allowed")
    # ensure top-level directory is allowed
    parts = rel_path.parts
    if len(parts) == 0 or parts[0] not in ALLOWED_TOP_DIRS:
        raise HTTPException(status_code=400, detail=f"Path must start with one of: {sorted(ALLOWED_TOP_DIRS)}")

    dest = (REPO_ROOT / rel_path).resolve()
    if not is_safe_path(REPO_ROOT, dest):
        raise HTTPException(status_code=400, detail="Path escapes repository root")

    # limit content size
    if len(content.encode("utf-8")) > MAX_CONTENT_BYTES:
        raise HTTPException(status_code=413, detail=f"Content too large (max {MAX_CONTENT_BYTES} bytes)")

    # create parent dirs
    dest.parent.mkdir(parents=True, exist_ok=True)
    # simple backup if file exists (copy, keep perms)
    try:
        if dest.exists():
            backup = dest.with_suffix(dest.suffix + ".bak")
            shutil.copy2(dest, backup)
        dest.write_text(content, encoding="utf-8")
    except Exception as e:
        LOG.exception("Failed to write file %s", dest)
        raise HTTPException(status_code=500, detail=f"Failed to write file: {e}")

    # audit
    try:
        entry = f"{time.strftime('%Y-%m-%d %H:%M:%S')}|apply-file|{auth or 'unknown'}|{dest}\n"
        AUDIT_LOG.write_text(AUDIT_LOG.read_text(encoding='utf-8') + entry, encoding='utf-8')
    except Exception:
        LOG.exception("Failed to append audit log")

    return {"result": "ok", "path": str(dest)}


@APP.post("/api/restart")
def restart_service(auth=Depends(require_api_key)):
    """Request systemd to restart the win12-manager service. Requires systemd/unit to be installed."""
    unit = os.environ.get("WIN12_SERVICE_NAME", "win12-manager.service")
    try:
        completed = subprocess.run(["/bin/systemctl", "restart", unit], capture_output=True, text=True, check=False)
    except Exception as e:
        LOG.exception("systemctl restart failed")
        raise HTTPException(status_code=500, detail=f"Failed to call systemctl: {e}")

    if completed.returncode != 0:
        raise HTTPException(status_code=500, detail={"stdout": completed.stdout, "stderr": completed.stderr, "rc": completed.returncode})

    return {"result": "restarted", "service": unit}


@APP.post("/api/git-pull")
def git_pull(auth=Depends(require_api_key)):
    """Perform a git pull in the repository root if enabled via WIN12_ENABLE_GIT_PULL=1"""
    enabled = os.environ.get("WIN12_ENABLE_GIT_PULL", "0")
    if enabled not in ("1", "true", "True"):
        raise HTTPException(status_code=403, detail="git-pull endpoint not enabled")
    try:
        completed = subprocess.run(["/usr/bin/git", "-C", str(REPO_ROOT), "pull"], capture_output=True, text=True, check=False)
    except Exception as e:
        LOG.exception("git pull failed")
        raise HTTPException(status_code=500, detail=f"git pull failed: {e}")
    return {"rc": completed.returncode, "stdout": completed.stdout, "stderr": completed.stderr}


@APP.exception_handler(HTTPException)
def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server.app.main:APP", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), reload=True)

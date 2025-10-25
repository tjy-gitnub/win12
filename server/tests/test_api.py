import os
from fastapi.testclient import TestClient

from server.app.main import APP


client = TestClient(APP)


def test_status():
    r = client.get("/api/status")
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"


def test_apply_file_and_cleanup():
    # use the API key from environment or default
    api_key = os.environ.get("WIN12_API_KEY", "changeme")
    payload = {"path": "data/test-api.txt", "content": "test-from-api"}
    headers = {"Authorization": f"Bearer {api_key}"}
    r = client.post("/api/apply-file", json=payload, headers=headers)
    assert r.status_code == 200
    assert "path" in r.json()
    # cleanup
    # Note: test writes into the repo; remove test file
    try:
        p = r.json().get("path")
        if p and os.path.exists(p):
            os.remove(p)
        bak = p + ".bak"
        if os.path.exists(bak):
            os.remove(bak)
    except Exception:
        pass

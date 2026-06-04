import urllib.request
import time
import sys

endpoints = [
    "/health",
    "/docs",
    "/projects",
    "/projects/proj-001",
    "/projects/proj-001/assets",
    "/projects/proj-001/findings",
    "/projects/proj-001/findings/fdg-001",
    "/projects/proj-001/timeline",
    "/projects/proj-001/graph",
    "/projects/proj-001/remediation",
    "/projects/proj-001/standards",
    "/projects/proj-001/reports",
    "/settings/usage",
    "/settings/detection-rules"
]

time.sleep(3) # wait for server to boot if needed

success = True
for ep in endpoints:
    url = f"http://localhost:8000{ep}"
    try:
        urllib.request.urlopen(url)
        print(f"? OK: {ep}")
    except Exception as e:
        print(f"? FAIL: {ep} - {e}")
        success = False

sys.exit(0 if success else 1)

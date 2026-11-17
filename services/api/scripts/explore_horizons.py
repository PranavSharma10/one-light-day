"""Step 2: ask JPL Horizons about Voyager 1 and look at the raw answer."""

from datetime import datetime, timedelta, timezone
from pathlib import Path

import httpx

URL = "https://ssd.jpl.nasa.gov/api/horizons.api"

now = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)
fmt = "%Y-%m-%d %H:%M"

params = {
    "format": "json",
    "COMMAND": "'-31'",            # Voyager 1
    "OBJ_DATA": "'NO'",            # skip the long object description
    "MAKE_EPHEM": "'YES'",
    "EPHEM_TYPE": "'OBSERVER'",
    "CENTER": "'500@399'",         # Earth's centre
    "START_TIME": f"'{now.strftime(fmt)}'",
    "STOP_TIME": f"'{(now + timedelta(hours=3)).strftime(fmt)}'",
    "STEP_SIZE": "'1 h'",
    "QUANTITIES": "'19,20,21'",
    "CSV_FORMAT": "'YES'",
}

r = httpx.get(URL, params=params, timeout=30)
print("HTTP status:", r.status_code)

body = r.json()
print("Keys in the JSON:", list(body))

result = body["result"]
print(result)

out = Path(__file__).resolve().parent.parent / "tests" / "fixtures" / "horizons_latest.txt"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(result, encoding="utf-8")
print(f"\nSaved to {out}")
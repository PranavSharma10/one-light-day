"""Look at NASA's DSN Now feed and find Voyager 1 (NAIF ID -31)."""

from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

import httpx

URL = "https://eyes.nasa.gov/dsn/data/dsn.xml"
FIXTURES = Path(__file__).resolve().parent.parent / "tests" / "fixtures"

r = httpx.get(URL, timeout=20)
print("HTTP status:", r.status_code, "|", len(r.text), "characters")
(FIXTURES / "dsn_latest.xml").write_text(r.text, encoding="utf-8")

found = False
for el in ET.fromstring(r.text):
    if el.tag == "station":
        print(f"\nSTATION {el.get('friendlyName')}")
    elif el.tag == "dish":
        targets = [t.get("name") for t in el.findall("target")]
        print(f"  {el.get('name')}: {targets}")
        for child in el:
            if child.get("spacecraftID") == "-31" or (child.tag == "target" and child.get("id") == "31"):
                found = True
                print("     >>>", child.tag, child.attrib)

if found:
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M")
    keep = FIXTURES / f"dsn_vgr1_{stamp}.xml"
    keep.write_text(r.text, encoding="utf-8")
    print("\nVoyager 1 is in the feed! Saved", keep)
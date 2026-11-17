"""Resize NASA originals for the timeline: at most 1200 px wide, JPEG quality 82.

1. Download each image into apps/web/images-src/timeline/, named after its
   moment id: launch.jpg, jupiter.jpg, pale-blue-dot.tif ...
2. From the project root, run:  python tools/prepare_timeline_images.py
3. The web-ready copies land in apps/web/public/images/timeline/
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "apps" / "web" / "images-src" / "timeline"
OUT = ROOT / "apps" / "web" / "public" / "images" / "timeline"
MAX_WIDTH = 1200
FORMATS = {".jpg", ".jpeg", ".png", ".tif", ".tiff"}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    files = sorted(p for p in SRC.iterdir() if p.suffix.lower() in FORMATS) if SRC.exists() else []
    if not files:
        raise SystemExit(f"No images found in {SRC}")

    for src in files:
        with Image.open(src) as original:
            im = original.convert("RGB")
        if im.width > MAX_WIDTH:
            im = im.resize((MAX_WIDTH, round(im.height * MAX_WIDTH / im.width)), Image.LANCZOS)
        dest = OUT / f"{src.stem}.jpg"
        im.save(dest, "JPEG", quality=82, optimize=True, progressive=True)
        print(f"{src.name:26} -> {dest.name:24} {im.width}x{im.height}  {dest.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
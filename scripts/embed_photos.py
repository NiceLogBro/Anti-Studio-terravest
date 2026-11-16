"""Embed curated Tool Guys gallery photos into the single-file Vite build."""

from __future__ import annotations

import argparse
import base64
import json
import re
import subprocess
import tempfile
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / "src/assets/photo-sources.json"
OUTPUT = ROOT / "src/assets/images.ts"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--keep-hero", action="store_true", help="Preserve the existing hero image bytes")
    args = parser.parse_args()

    photos = json.loads(SOURCES.read_text(encoding="ascii"))
    existing_hero = None
    if args.keep_hero:
        match = re.search(
            r'^  hero: "(data:image/webp;base64,[A-Za-z0-9+/=]+)",$',
            OUTPUT.read_text(encoding="ascii"),
            re.MULTILINE,
        )
        if not match:
            raise ValueError("Could not find the current hero image to preserve")
        existing_hero = match.group(1)

    lines = [
        "// Generated from photo-sources.json by scripts/embed_photos.py.\n",
        "export const photos = {\n",
    ]

    with tempfile.TemporaryDirectory() as temp_dir:
        temp = Path(temp_dir)
        for name, photo in photos.items():
            if name == "hero" and existing_hero:
                lines.append(f'  hero: "{existing_hero}",\n')
                print("hero: preserved existing image")
                continue

            source = temp / f"{name}.jpg"
            optimized = temp / f"{name}.webp"
            size = "2500w" if photo["width"] >= 1600 else "1500w"
            request = urllib.request.Request(
                f'{photo["url"]}?format={size}',
                headers={"User-Agent": "Mozilla/5.0"},
            )
            with urllib.request.urlopen(request, timeout=40) as response:
                source.write_bytes(response.read())
            command = ["convert", str(source), "-auto-orient", "-resize", f'{photo["width"]}x']
            if "gamma" in photo:
                command.extend(["-gamma", str(photo["gamma"])])
            command.extend(
                ["-strip", "-quality", str(photo["quality"]), "-define", "webp:method=6", str(optimized)]
            )
            subprocess.run(command, check=True)
            data = optimized.read_bytes()
            if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
                raise ValueError(f"Invalid WebP photo: {name}")
            encoded = base64.b64encode(data).decode("ascii")
            lines.append(f'  {name}: "data:image/webp;base64,{encoded}",\n')
            print(f"{name}: {len(data) // 1024} KB")

    lines.extend(
        [
            "} as const;\n\n",
            'export const photoGalleryUrl = "https://powerwashingoahu.com/recentprojects";\n',
        ]
    )
    OUTPUT.write_text("".join(lines), encoding="ascii")
    print(f"Embedded {len(photos)} official project photos in {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
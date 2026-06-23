from pathlib import Path

from PIL import Image

SOURCE = Path("/home/ubuntu/upload/99E8DFD1-E837-43E2-BF4E-6ACE65F714C0.png")
PUBLIC_DIR = Path("/home/ubuntu/sinace-site/client/public")
ICONS_DIR = PUBLIC_DIR / "icons"

OUTPUTS = {
    ICONS_DIR / "icon-192.png": (192, 192),
    ICONS_DIR / "icon-512.png": (512, 512),
    ICONS_DIR / "maskable-icon-512.png": (512, 512),
    ICONS_DIR / "apple-touch-icon-180.png": (180, 180),
    PUBLIC_DIR / "favicon-32x32.png": (32, 32),
    PUBLIC_DIR / "favicon-16x16.png": (16, 16),
    PUBLIC_DIR / "favicon.ico": (64, 64),
}


def build_master_square(image: Image.Image) -> Image.Image:
    width, height = image.size
    side = min(height, int(width * 0.72))
    left = 0
    top = max(0, (height - side) // 2)
    crop = image.crop((left, top, left + side, top + side))
    return crop.resize((1024, 1024), Image.Resampling.LANCZOS)


if __name__ == "__main__":
    ICONS_DIR.mkdir(parents=True, exist_ok=True)

    with Image.open(SOURCE) as img:
        img = img.convert("RGBA")
        master = build_master_square(img)

    for output_path, size in OUTPUTS.items():
        output_path.parent.mkdir(parents=True, exist_ok=True)
        rendered = master.resize(size, Image.Resampling.LANCZOS)
        if output_path.suffix == ".ico":
            rendered.save(output_path, sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
        else:
            rendered.save(output_path)

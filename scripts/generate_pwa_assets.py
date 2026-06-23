from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont

SOURCE = Path('/home/ubuntu/upload/2E282DFE-2672-4AC9-85E7-4F23C3D269BA.png')
PUBLIC_DIR = Path('/home/ubuntu/sinace-site/client/public')
ICONS_DIR = PUBLIC_DIR / 'icons'
SPLASH_DIR = PUBLIC_DIR / 'splash'
BG_TOP = '#071833'
BG_BOTTOM = '#0a2347'
ACCENT = '#74e0cf'
TEXT = '#f7fbff'
SUBTEXT = '#c7d7ef'

ICON_SIZES = {
    'icon-192.png': 192,
    'icon-512.png': 512,
    'apple-touch-icon-180.png': 180,
    'maskable-icon-512.png': 512,
}

SPLASH_SPECS = [
    ('apple-splash-1179-2556.png', (1179, 2556)),
    ('apple-splash-1290-2796.png', (1290, 2796)),
    ('apple-splash-1170-2532.png', (1170, 2532)),
    ('apple-splash-1125-2436.png', (1125, 2436)),
    ('apple-splash-1242-2688.png', (1242, 2688)),
    ('apple-splash-828-1792.png', (828, 1792)),
    ('apple-splash-750-1334.png', (750, 1334)),
    ('apple-splash-1242-2208.png', (1242, 2208)),
]


def ensure_dirs():
    ICONS_DIR.mkdir(parents=True, exist_ok=True)
    SPLASH_DIR.mkdir(parents=True, exist_ok=True)


def make_background(size: tuple[int, int]) -> Image.Image:
    width, height = size
    img = Image.new('RGB', size, BG_BOTTOM)
    draw = ImageDraw.Draw(img)

    for y in range(height):
        ratio = y / max(height - 1, 1)
        r1, g1, b1 = (7, 24, 51)
        r2, g2, b2 = (10, 35, 71)
        color = (
            int(r1 + (r2 - r1) * ratio),
            int(g1 + (g2 - g1) * ratio),
            int(b1 + (b2 - b1) * ratio),
        )
        draw.line((0, y, width, y), fill=color)

    glow_color = (116, 224, 207, 28)
    for radius, alpha in ((int(width * 0.32), 48), (int(width * 0.18), 80)):
        overlay = Image.new('RGBA', size, (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        center = (int(width * 0.5), int(height * 0.26))
        box = (
            center[0] - radius,
            center[1] - radius,
            center[0] + radius,
            center[1] + radius,
        )
        overlay_draw.ellipse(box, fill=(116, 224, 207, alpha))
        img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')

    return img


def prepare_logo(size: int, maskable: bool = False) -> Image.Image:
    source = Image.open(SOURCE).convert('RGBA')
    if maskable:
        target = int(size * 0.62)
    else:
        target = int(size * 0.7)
    contained = ImageOps.contain(source, (target, target))

    canvas = Image.new('RGBA', (size, size), BG_BOTTOM)
    offset = ((size - contained.width) // 2, (size - contained.height) // 2)
    canvas.alpha_composite(contained, offset)

    border = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(border)
    pad = max(2, size // 32)
    draw.rounded_rectangle((pad, pad, size - pad, size - pad), radius=size // 4, outline=(116, 224, 207, 72), width=max(2, size // 48))
    canvas = Image.alpha_composite(canvas, border)
    return canvas.convert('RGB')


def save_icons():
    for filename, size in ICON_SIZES.items():
        icon = prepare_logo(size=size, maskable='maskable' in filename)
        icon.save(ICONS_DIR / filename, format='PNG')


def load_font(size: int):
    for candidate in (
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf',
    ):
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def load_regular_font(size: int):
    for candidate in (
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf',
    ):
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def save_splashes():
    source = Image.open(SOURCE).convert('RGBA')

    for filename, (width, height) in SPLASH_SPECS:
        base = make_background((width, height)).convert('RGBA')
        draw = ImageDraw.Draw(base)

        logo_max_w = int(width * 0.38)
        logo_max_h = int(height * 0.18)
        logo = ImageOps.contain(source, (logo_max_w, logo_max_h))
        logo_x = (width - logo.width) // 2
        logo_y = int(height * 0.18)
        base.alpha_composite(logo, (logo_x, logo_y))

        title_font = load_font(max(28, width // 16))
        subtitle_font = load_regular_font(max(18, width // 32))

        title = 'SINACE'
        subtitle = 'Sistema Nacional de Acesso Cirúrgico Especializado'
        detail = 'Plataforma assistencial, educacional e institucional'

        title_bbox = draw.textbbox((0, 0), title, font=title_font)
        title_w = title_bbox[2] - title_bbox[0]
        title_y = logo_y + logo.height + int(height * 0.055)
        draw.text(((width - title_w) / 2, title_y), title, fill=TEXT, font=title_font)

        subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
        subtitle_w = subtitle_bbox[2] - subtitle_bbox[0]
        subtitle_y = title_y + title_font.size + int(height * 0.018)
        draw.text(((width - subtitle_w) / 2, subtitle_y), subtitle, fill=SUBTEXT, font=subtitle_font)

        detail_bbox = draw.textbbox((0, 0), detail, font=subtitle_font)
        detail_w = detail_bbox[2] - detail_bbox[0]
        detail_y = subtitle_y + subtitle_font.size + int(height * 0.012)
        draw.text(((width - detail_w) / 2, detail_y), detail, fill=ACCENT, font=subtitle_font)

        line_width = int(width * 0.22)
        line_height = max(4, height // 320)
        line_x = (width - line_width) // 2
        line_y = detail_y + subtitle_font.size + int(height * 0.03)
        draw.rounded_rectangle((line_x, line_y, line_x + line_width, line_y + line_height), radius=line_height // 2, fill=ACCENT)

        base.convert('RGB').save(SPLASH_DIR / filename, format='PNG')


def main():
    ensure_dirs()
    save_icons()
    save_splashes()
    print(f'Assets gerados em {PUBLIC_DIR}')


if __name__ == '__main__':
    main()

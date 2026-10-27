"""
Gera todos os ícones do SINACE (PWA, Android e iOS) a partir de uma única marca vetorial.

Fonte única: o desenho da marca (cruz biomédica + caduceu + arco) definido abaixo em SVG.
Saídas:
  resources/icon/*.svg                      -> masters vetoriais (ícone, camadas adaptativas, monocromático)
  resources/android/app/src/main/res/       -> mipmaps legados, ícone adaptativo (API 26+) e monocromático (API 33+)
  resources/ios/App/App/Assets.xcassets/    -> asset catalog com AppIcon.appiconset e Splash.imageset
  resources/store/                          -> ícones de loja (Google Play 512, App Store 1024)
  client/public/                            -> ícones do PWA, favicons e SVG

Requisitos: Pillow e um Chromium headless (Playwright) para rasterizar o SVG.
  python3 scripts/generate_app_icons.py
  CHROME_BIN=/caminho/para/chrome python3 scripts/generate_app_icons.py
"""

from __future__ import annotations

import glob
import json
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
RESOURCES = ROOT / "resources"
PUBLIC_DIR = ROOT / "client" / "public"
ANDROID_RES = RESOURCES / "android" / "app" / "src" / "main" / "res"
IOS_ASSETS = RESOURCES / "ios" / "App" / "App" / "Assets.xcassets"
STORE_DIR = RESOURCES / "store"

MASTER = 1024
# Fundo claro da marca (o logotipo oficial é aplicado sobre branco).
BACKGROUND_TOP = "#FFFFFF"
BACKGROUND_BOTTOM = "#E6F0FA"
BACKGROUND_SOLID = "#F3F8FD"
SPLASH_BACKGROUND = "#FFFFFF"

# A marca é desenhada em 1024 e reduzida para caber na zona segura do ícone adaptativo
# (66dp de 108dp ≈ círculo de raio 313px): nada essencial é cortado por máscaras circulares.
MARK_SCALE = 0.88

DEFS = """
  <linearGradient id="cross" x1="762" y1="210" x2="262" y2="800" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#8DC63F"/>
    <stop offset="0.45" stop-color="#1F9A6A"/>
    <stop offset="1" stop-color="#1B4F9C"/>
  </linearGradient>
  <linearGradient id="silver" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#C9D5E2"/>
    <stop offset="0.5" stop-color="#FFFFFF"/>
    <stop offset="1" stop-color="#B7C6D6"/>
  </linearGradient>
  <linearGradient id="swoosh" x1="290" y1="520" x2="760" y2="810" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#7FA8D6"/>
    <stop offset="0.55" stop-color="#C3D2E3"/>
    <stop offset="1" stop-color="#2F7FD0" stop-opacity="0.15"/>
  </linearGradient>
"""

CROSS = '<path d="M450 210h124a28 28 0 0 1 28 28v122h132a28 28 0 0 1 28 28v114a28 28 0 0 1-28 28H602v242a28 28 0 0 1-28 28H450a28 28 0 0 1-28-28V530H290a28 28 0 0 1-28-28V388a28 28 0 0 1 28-28h132V238a28 28 0 0 1 28-28z"/>'
SWOOSH = '<path d="M300 520C226 640 262 790 470 820c106 15 196 6 270-14-94 4-188 2-270-14-150-30-204-140-170-272z"/>'
WING = "M528 404c58-40 132-54 204-36-22 12-34 24-48 30 8 2 14 2 22 0-20 14-40 20-62 20 6 3 12 4 18 4-30 14-82 16-134 8z"
CADUCEUS_PARTS = f"""
    <rect x="502" y="250" width="20" height="590" rx="10"/>
    <circle cx="512" cy="250" r="30"/>
    <path d="{WING}"/>
    <path d="{WING}" transform="translate(1024 0) scale(-1 1)"/>
"""
SERPENT = '<path d="M560 452c40 22 4 52-48 60-70 12-70 64 0 74 72 10 72 62 0 72-62 10-62 62 0 72" fill="none" stroke-width="22" stroke-linecap="round"/><ellipse cx="566" cy="446" rx="26" ry="16" transform="rotate(-20 566 446)"/>'


def mark_group(inner: str) -> str:
    offset = MASTER / 2 * (1 - MARK_SCALE)
    return f'<g transform="translate({offset:.1f} {offset:.1f}) scale({MARK_SCALE})">{inner}</g>'


def color_mark() -> str:
    return mark_group(
        f"""
    <g fill="url(#swoosh)">{SWOOSH}</g>
    <g fill="url(#cross)">{CROSS}</g>
    <g fill="url(#silver)" stroke="#8FA4BC" stroke-width="4">{CADUCEUS_PARTS}</g>
    <g fill="#FFFFFF" stroke="#FFFFFF">{SERPENT}</g>
    <g fill="none" stroke="#8FA4BC" stroke-width="3" opacity="0.6">{SERPENT.replace('stroke-width="22"', '')}</g>
"""
    )


def svg(body: str, defs: str = DEFS) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{MASTER}" height="{MASTER}" viewBox="0 0 {MASTER} {MASTER}">'
        f"<defs>{defs}</defs>{body}</svg>\n"
    )


def background_rect() -> str:
    return (
        '<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">'
        f'<stop offset="0" stop-color="{BACKGROUND_TOP}"/><stop offset="1" stop-color="{BACKGROUND_BOTTOM}"/>'
        "</linearGradient>",
        f'<rect width="{MASTER}" height="{MASTER}" fill="url(#bg)"/>',
    )


def build_svgs() -> dict[str, str]:
    bg_def, bg_rect = background_rect()
    # Monocromático (Android 13 "ícones temáticos"): silhueta única, caduceu vazado.
    mono_mask = (
        '<mask id="knockout"><rect width="1024" height="1024" fill="#fff"/>'
        f'<g fill="#000" stroke="#000">{CADUCEUS_PARTS}{SERPENT}</g></mask>'
    )
    mono = mark_group(f'<g fill="#000000" mask="url(#knockout)">{CROSS}{SWOOSH}</g>')
    return {
        "icon.svg": svg(bg_rect + color_mark(), DEFS + bg_def),
        "icon-foreground.svg": svg(color_mark()),
        "icon-background.svg": svg(bg_rect, bg_def),
        "icon-monochrome.svg": svg(mono, mono_mask),
    }


def find_chrome() -> str:
    candidates = [os.environ.get("CHROME_BIN", "")]
    candidates += sorted(glob.glob(os.path.expanduser("~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-*/headless_shell")))
    candidates += sorted(glob.glob(os.path.expanduser("~/.cache/ms-playwright/chromium_headless_shell-*/chrome-*/headless_shell")))
    candidates += [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        shutil.which("chromium") or "",
        shutil.which("google-chrome") or "",
    ]
    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return candidate
    raise SystemExit("Chromium não encontrado. Instale com `npx playwright install chromium` ou defina CHROME_BIN.")


def rasterize(svg_path: Path, out_path: Path, chrome: str) -> Image.Image:
    with tempfile.TemporaryDirectory() as tmp:
        html = Path(tmp) / "render.html"
        html.write_text(
            "<!doctype html><html><head><style>html,body{margin:0;background:transparent}"
            f"img{{display:block;width:{MASTER}px;height:{MASTER}px}}</style></head>"
            f'<body><img src="{svg_path.as_uri()}"></body></html>'
        )
        subprocess.run(
            [
                chrome,
                "--headless",
                "--disable-gpu",
                "--hide-scrollbars",
                "--force-device-scale-factor=1",
                "--default-background-color=00000000",
                f"--window-size={MASTER},{MASTER}",
                f"--screenshot={out_path}",
                html.as_uri(),
            ],
            check=True,
            capture_output=True,
        )
    return Image.open(out_path).convert("RGBA")


def save(image: Image.Image, path: Path, size: int, opaque: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    rendered = image.resize((size, size), Image.Resampling.LANCZOS)
    if opaque:
        # App Store rejeita ícones com canal alfa.
        flat = Image.new("RGB", rendered.size, BACKGROUND_SOLID)
        flat.paste(rendered, mask=rendered.getchannel("A"))
        rendered = flat
    rendered.save(path, optimize=True)


def circle_crop(image: Image.Image) -> Image.Image:
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).ellipse((0, 0, image.width - 1, image.height - 1), fill=255)
    result = image.copy()
    result.putalpha(mask)
    return result


def build_android(icon: Image.Image, fg: Image.Image, bg: Image.Image, mono: Image.Image) -> None:
    densities = {"mdpi": 1, "hdpi": 1.5, "xhdpi": 2, "xxhdpi": 3, "xxxhdpi": 4}
    # O legado usa o ícone completo recortado (squircle/círculo aplicado pelo launcher antigo).
    round_icon = circle_crop(icon)
    for name, scale in densities.items():
        folder = ANDROID_RES / f"mipmap-{name}"
        save(icon, folder / "ic_launcher.png", round(48 * scale))
        save(round_icon, folder / "ic_launcher_round.png", round(48 * scale))
        save(fg, folder / "ic_launcher_foreground.png", round(108 * scale))
        save(bg, folder / "ic_launcher_background.png", round(108 * scale))
        save(mono, folder / "ic_launcher_monochrome.png", round(108 * scale))

    adaptive = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
    <monochrome android:drawable="@mipmap/ic_launcher_monochrome" />
</adaptive-icon>
"""
    anydpi = ANDROID_RES / "mipmap-anydpi-v26"
    anydpi.mkdir(parents=True, exist_ok=True)
    (anydpi / "ic_launcher.xml").write_text(adaptive)
    (anydpi / "ic_launcher_round.xml").write_text(adaptive)

    values = ANDROID_RES / "values"
    values.mkdir(parents=True, exist_ok=True)
    (values / "ic_launcher_background.xml").write_text(
        f"""<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">{BACKGROUND_SOLID}</color>
</resources>
"""
    )


IOS_ICONS = [
    # (idiom, tamanho em pt, escala)
    ("iphone", 20, 2), ("iphone", 20, 3),
    ("iphone", 29, 2), ("iphone", 29, 3),
    ("iphone", 40, 2), ("iphone", 40, 3),
    ("iphone", 60, 2), ("iphone", 60, 3),
    ("ipad", 20, 1), ("ipad", 20, 2),
    ("ipad", 29, 1), ("ipad", 29, 2),
    ("ipad", 40, 1), ("ipad", 40, 2),
    ("ipad", 76, 1), ("ipad", 76, 2),
    ("ipad", 83.5, 2),
    ("ios-marketing", 1024, 1),
]


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2) + "\n")


def build_ios(icon: Image.Image, fg: Image.Image) -> None:
    info = {"author": "xcode", "version": 1}
    write_json(IOS_ASSETS / "Contents.json", {"info": info})

    appicon = IOS_ASSETS / "AppIcon.appiconset"
    if appicon.exists():
        shutil.rmtree(appicon)
    images = []
    for idiom, points, scale in IOS_ICONS:
        pixels = round(points * scale)
        size_label = f"{points:g}x{points:g}"
        filename = f"AppIcon-{size_label}@{scale}x.png"
        save(icon, appicon / filename, pixels, opaque=True)
        images.append({"filename": filename, "idiom": idiom, "scale": f"{scale}x", "size": size_label})
    write_json(appicon / "Contents.json", {"images": images, "info": info})

    # Splash (padrão do Capacitor): marca centralizada sobre fundo branco, 2732×2732.
    splash = IOS_ASSETS / "Splash.imageset"
    splash.mkdir(parents=True, exist_ok=True)
    canvas = Image.new("RGB", (2732, 2732), SPLASH_BACKGROUND)
    mark = fg.resize((900, 900), Image.Resampling.LANCZOS)
    canvas.paste(mark, ((2732 - 900) // 2, (2732 - 900) // 2), mark)
    splash_images = []
    for scale in (1, 2, 3):
        filename = f"splash-2732x2732{'' if scale == 1 else f'-{scale}'}.png"
        canvas.save(splash / filename, optimize=True)
        splash_images.append({"filename": filename, "idiom": "universal", "scale": f"{scale}x"})
    write_json(splash / "Contents.json", {"images": splash_images, "info": info})


def build_web(icon: Image.Image, svgs: dict[str, str]) -> None:
    icons_dir = PUBLIC_DIR / "icons"
    save(icon, icons_dir / "icon-192.png", 192)
    save(icon, icons_dir / "icon-512.png", 512)
    # A marca já está dentro da zona segura (80% central), então o mesmo desenho serve como maskable.
    save(icon, icons_dir / "maskable-icon-512.png", 512)
    save(icon, icons_dir / "apple-touch-icon-180.png", 180, opaque=True)
    save(icon, PUBLIC_DIR / "favicon-32x32.png", 32)
    save(icon, PUBLIC_DIR / "favicon-16x16.png", 16)
    icon.resize((64, 64), Image.Resampling.LANCZOS).save(
        PUBLIC_DIR / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
    )
    (icons_dir / "icon.svg").write_text(svgs["icon.svg"])


def main() -> None:
    chrome = find_chrome()
    svg_dir = RESOURCES / "icon"
    svg_dir.mkdir(parents=True, exist_ok=True)
    svgs = build_svgs()
    rendered: dict[str, Image.Image] = {}
    with tempfile.TemporaryDirectory() as tmp:
        for name, content in svgs.items():
            svg_path = svg_dir / name
            svg_path.write_text(content)
            png_path = Path(tmp) / name.replace(".svg", ".png")
            rendered[name] = rasterize(svg_path, png_path, chrome)
            rendered[name].save(svg_dir / name.replace(".svg", ".png"), optimize=True)

    icon = rendered["icon.svg"]
    fg = rendered["icon-foreground.svg"]
    bg = rendered["icon-background.svg"]
    mono = rendered["icon-monochrome.svg"]

    build_android(icon, fg, bg, mono)
    build_ios(icon, fg)
    build_web(icon, svgs)
    save(icon, STORE_DIR / "google-play-icon-512.png", 512)
    save(icon, STORE_DIR / "app-store-icon-1024.png", 1024, opaque=True)
    print(f"Ícones gerados em {RESOURCES.relative_to(ROOT)} e {PUBLIC_DIR.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

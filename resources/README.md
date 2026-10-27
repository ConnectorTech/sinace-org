# Ícones do SINACE para Google Play e App Store

Tudo nesta pasta é gerado por `scripts/generate_app_icons.py` a partir de uma única marca vetorial
(cruz biomédica + caduceu + arco). Para alterar o ícone, edite o desenho no script e rode:

```bash
python3 scripts/generate_app_icons.py
```

O script também atualiza os ícones do PWA e os favicons em `client/public/`.
Requisitos: Pillow e um Chromium headless (`npx playwright install chromium`, ou `CHROME_BIN=...`).

## Conteúdo

| Pasta | Uso |
| --- | --- |
| `icon/` | Masters em SVG (e PNG 1024): ícone completo, camadas `foreground`/`background` e `monochrome`. |
| `android/app/src/main/res/` | `mipmap-*dpi` (legado 48dp e camadas de 108dp), `mipmap-anydpi-v26` (ícone adaptativo com camada monocromática do Android 13) e `values/ic_launcher_background.xml`. |
| `ios/App/App/Assets.xcassets/` | Asset catalog: `AppIcon.appiconset` (iPhone, iPad e 1024 de marketing, sem canal alfa) e `Splash.imageset` (2732×2732). |
| `store/` | `google-play-icon-512.png` (ficha da Play Store) e `app-store-icon-1024.png` (App Store Connect, sem alfa). |

## Como aplicar no projeto nativo (Capacitor)

Os caminhos já seguem a estrutura gerada por `npx cap add android` e `npx cap add ios`:

```bash
cp -R resources/android/app/src/main/res/. android/app/src/main/res/
cp -R resources/ios/App/App/Assets.xcassets/. ios/App/App/Assets.xcassets/
```

## Regras seguidas

- **Zona segura do ícone adaptativo**: a marca ocupa o círculo central de 66dp dos 108dp da camada
  de frente, então nenhum formato de máscara do launcher corta a cruz.
- **iOS**: PNGs opacos (sem alfa) e sem cantos arredondados — o sistema aplica a máscara.
- **Maskable (PWA)**: o mesmo desenho, já dentro da zona segura de 80%.

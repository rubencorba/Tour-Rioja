# Recorrido Virtual — Vivienda Rioja

360° virtual house tour built with React, TypeScript, Vite, Tailwind CSS and Pannellum.

See [AGENTS.md](./AGENTS.md) for the full architecture, folder structure, data flow, and — most importantly — the exact steps to add a new room.

## Quick start

```bash
npm install
npm run dev
```

## ⚠️ Before the app will run

The panorama images are **not included** in this scaffold and must be added manually to `src/assets/panoramas/`:

- `ComedorRioja.png`
- `BanioRioja.png`
- `PasilloRioja.png`
- `Dormitorio1Rioja.png`
- `Dormitorio2Rioja.png`

And the landing background at `src/assets/fachadaRioja.png`.

Until those files exist, `npm run dev` / `npm run build` will fail to resolve them — that's expected. Type-checking (`npx tsc -b`) does not depend on the images and already passes.

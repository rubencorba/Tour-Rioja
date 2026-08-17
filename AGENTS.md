# AGENTS.md — Recorrido Virtual: Vivienda Rioja

This file is the reference for any human or AI agent working on this codebase. Read it before modifying anything under `src/`.

## 1. What this is

A 360° virtual house tour. The visitor lands on a static photo of the apartment's entrance door, presses **Go Home**, and steps into an equirectangular-panorama tour of the apartment where every room is connected to its neighbours through interactive hotspots rendered inside the panorama itself.

The single hard requirement driving every architectural decision below: **adding a new room must never require touching application logic** — only a new image file and a new configuration object.

## 2. Tech stack

| Concern | Choice |
|---|---|
| UI framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin, tokens in `src/styles/index.css`) |
| 360° viewer | [Pannellum](https://pannellum.org/) (`pannellum` npm package) + `@types/pannellum` |
| Routing | None — only two screens exist (landing, tour), handled with a single `useState` in `App.tsx`. Do not add `react-router` unless the app grows past two screens. |
| State management | React state/hooks only. No external state library — the app's only real state is "which screen" and "which scene is active," both already owned by the components that need them. |

No other runtime dependencies. Keep it that way — the brief explicitly calls for "no unnecessary libraries."

## 3. Folder structure

```
src/
├── assets/
│   ├── panoramas/          # equirectangular room images (see §6)
│   └── fachadaRioja.png    # landing page background
├── components/              # small, reusable, presentation-focused pieces
├── pages/                   # one component per screen (Landing, Tour)
├── data/                    # rooms.ts — THE navigation/config source of truth
├── hooks/                   # usePannellumViewer, useOrientationGuard
├── services/                # pannellumService.ts — all direct Pannellum API calls
├── types/                   # room.types.ts — RoomConfig / RoomHotspot / RoomMap
├── utils/                   # device.ts — small, pure helpers
├── styles/                  # index.css — Tailwind entry + design tokens + Pannellum skin
├── App.tsx
└── main.tsx
```

Layering rule (Clean Architecture, kept lightweight for an app this size):

- **`types/`** has no dependencies on anything else.
- **`data/`** depends only on `types/` and on the imported image assets.
- **`services/`** depends only on `types/`. It is the *only* place that talks to the global `window.pannellum` object.
- **`hooks/`** depend on `services/`, `data/`, `utils/` and `types/`, and are the *only* place `useEffect`/lifecycle wiring for the viewer or the orientation listener lives.
- **`components/` and `pages/`** depend on `hooks/`, `data/` and `types/` for props, but never call `window.pannellum` or `addEventListener` directly.

## 4. Data flow

```
data/rooms.ts (ROOMS, ROOM_MAP, ENTRY_ROOM_ID)
        │
        ▼
pages/TourPage.tsx  ──passes ROOMS + ENTRY_ROOM_ID──▶  components/PanoramaViewer.tsx
        │                                                       │
        │                                              hooks/usePannellumViewer.ts
        │                                                       │
        │                                          services/pannellumService.ts
        │                                            (builds Pannellum tour config,
        │                                             calls window.pannellum.viewer)
        ▼
hooks/useOrientationGuard.ts ──▶ components/RotateDevicePrompt.tsx (portrait phones only)
```

- `App.tsx` only decides whether to render `LandingPage` or `TourPage`.
- `LandingPage` renders the static facade photo and the "Go Home" button; it has zero knowledge of rooms or Pannellum.
- `TourPage` reads `ROOMS`/`ENTRY_ROOM_ID` from `data/rooms.ts` and hands them to `PanoramaViewer` — it does not know how many rooms exist.
- `PanoramaViewer` delegates all viewer lifecycle work to `usePannellumViewer`, which in turn delegates all Pannellum-specific config-building to `pannellumService.createTourViewer`.
- Navigation between rooms happens through Pannellum's built-in **scene hotspots** (`type: "scene"`, `sceneId: <room id>`), configured entirely from each room's `hotspots` array in `data/rooms.ts`. There are no floating HTML buttons layered on top of the panorama and no hardcoded `if (room === 'X')` navigation logic anywhere in the codebase.

### Why the Pannellum "tour config" shape, not `addScene`

`@types/pannellum` only types a single-scene `ConfigOptions`. Pannellum's actual runtime (`pannellum/build/pannellum.js`) also accepts a multi-scene "tour" shape: `{ default: { firstScene }, scenes: { ... } }`. `pannellumService.ts` builds that shape directly (typed locally as `PannellumTourConfig`, with one explicit, documented cast) rather than constructing a single scene and calling `viewer.addScene()` afterward — `addScene` writes into `configuration.scenes`, which only exists if the viewer was already initialized with a tour config. Read the comment at the top of `pannellumService.ts` before changing this.

## 5. The room data model

```ts
interface RoomHotspot {
  target: string;   // id of the room this hotspot leads to
  yaw: number;       // degrees
  pitch: number;      // degrees
  label: string;       // hover text, e.g. "Ir al Pasillo"
}

interface RoomConfig {
  id: string;
  title: string;
  image: string;        // imported panorama asset
  initialYaw: number;
  initialPitch: number;
  initialHfov: number;
  hotspots: RoomHotspot[];
}
```

`data/rooms.ts` exports:

- `ROOMS: RoomConfig[]` — the full list, in the order they should be registered with Pannellum.
- `ROOM_MAP: RoomMap` — the same list indexed by `id` for O(1) lookups.
- `ENTRY_ROOM_ID: string` — which room the tour opens on (currently `"Comedor"`).

## 6. How to add a new room (no application logic changes)

1. Drop the new equirectangular panorama into `src/assets/panoramas/`.
2. Import it at the top of `src/data/rooms.ts`, next to the other panorama imports.
3. Append a new `RoomConfig` object to the `ROOMS` array with a unique `id`.
4. Add a hotspot in whichever existing room(s) should connect to it (`target: "<new id>"`), and add hotspot(s) in the new room's own `hotspots` array pointing back to its neighbours.
5. Open the tour, walk into the new room, and fine-tune each hotspot's `yaw`/`pitch` so it sits exactly on the doorway/opening it represents (see §7).

Nothing in `components/`, `pages/`, `hooks/`, or `services/` needs to change. If a change there turns out to be necessary, that's a signal the room was modeled incorrectly, not that the new room is a special case.

## 7. Tuning hotspot placement

The `yaw`/`pitch` values currently in `data/rooms.ts` are reasonable placeholders (compass-style front/back/left/right positions), written before the real panoramas existed. Once real images are in place:

1. Run `npm run dev` and walk into each room.
2. Note the yaw/pitch shown by Pannellum's hotspot debug mode (temporarily set `hotSpotDebug: true` in `pannellumService.toSceneConfig`, click where the hotspot should sit, read the console, then revert the flag).
3. Update the corresponding hotspot's `yaw`/`pitch` in `data/rooms.ts`.

## 8. Landing page & panorama assets — critical rules

- Panorama images live at `src/assets/panoramas/{ComedorRioja,BanioRioja,PasilloRioja,Dormitorio1Rioja,Dormitorio2Rioja}.png` and the landing background at `src/assets/fachadaRioja.png`. These are **not** part of this scaffold and are added manually afterward.
- Do not generate placeholder binary image content to "make the build pass." A failing `vite build`/`vite dev` because these files are physically absent is expected and is not a bug to fix. Use `npx tsc -b` (already passing) to validate the code itself.
- Do not invent additional panorama filenames beyond the five listed above unless a new room is explicitly requested.

## 9. Orientation guard (rotate-device prompt)

`hooks/useOrientationGuard.ts` re-evaluates on every `resize`/`orientationchange`/Screen Orientation API event and returns `true` whenever the viewport looks like a phone in portrait mode (see `utils/device.ts` for the exact heuristic). `TourPage` renders `<RotateDevicePrompt />` on top of the viewer whenever that's `true`. Because the check re-runs on every orientation event rather than being dismissed once, the prompt reappears every time the visitor rotates back to portrait, per spec. The landing page intentionally does **not** use this guard — only the panorama tour requires landscape.

## 10. Visual design system

The UI follows an "architectural plan" direction: warm paper background, ink-dark text, a deep blueprint-teal accent for structure/chrome, and a brass "seal" accent reserved for the primary action on each screen (the landing page's entry button, hotspot markers). Tokens live in `src/styles/index.css` under `@theme` (Tailwind v4 syntax) — extend them there rather than hardcoding new hex values in components. Pannellum's default viewer chrome is re-skinned in the same file to match (see the `.pnlm-*` overrides) rather than fighting it with `!important` overrides scattered across components.

## 11. Commands

```bash
npm run dev       # start Vite dev server
npx tsc -b        # type-check (safe to run without real panorama images in place)
npm run build     # tsc -b && vite build — requires real images to succeed
npm run lint      # oxlint
```

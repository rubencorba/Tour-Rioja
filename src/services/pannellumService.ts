import type { RoomConfig } from "../types/room.types";

/**
 * Thin wrapper around the global `pannellum` object (exposed by the
 * `pannellum` package as `window.pannellum`, per `@types/pannellum` ->
 * `interface Window { pannellum: { viewer(container, initialConfig) } }`).
 *
 * Keeping all direct Pannellum calls in this module means components never
 * talk to the viewer library directly, and the library could be swapped
 * later without touching `components/` or `pages/`.
 *
 * NOTE ON THE TOUR CONFIG SHAPE: `@types/pannellum`'s `ConfigOptions` only
 * types a *single* panorama. Pannellum's actual runtime (verified by
 * reading `pannellum/build/pannellum.js`) also accepts a multi-scene "tour"
 * shape at the top level: `{ default: { firstScene }, scenes: { ... } }`.
 * That shape isn't part of the published types, so it's declared locally
 * below as `PannellumTourConfig` rather than reached for with `as any`.
 * (The alternative — constructing with a single-scene config and calling
 * `viewer.addScene()` afterward — fails at runtime: `addScene` writes into
 * `configuration.scenes`, which only exists once a tour config created it.)
 */

/** Local typing for Pannellum's multi-scene tour configuration shape. */
interface PannellumTourConfig {
  default: Partial<Pannellum.ConfigOptions> & { firstScene: string };
  scenes: Record<string, Pannellum.ConfigOptions>;
}

const ENTRY_DRIFT_SPEED = 4.4;
const ENTRY_DRIFT_STOP_DELAY_MS = 3000;

function driftDirectionFor(roomId: string): 1 | -1 {
  let hash = 0;
  for (let i = 0; i < roomId.length; i++) {
    hash = (hash + roomId.charCodeAt(i)) | 0;
  }
  return hash % 2 === 0 ? 1 : -1;
}

/** Converts a `RoomConfig` into a Pannellum scene hotspot list. */
function toHotSpots(room: RoomConfig): Pannellum.HotspotOptions[] {
  return room.hotspots.map((hotspot) => ({
    type: "scene",
    sceneId: hotspot.target,
    yaw: hotspot.yaw,
    pitch: hotspot.pitch,
    text: hotspot.label,
    cssClass: "tour-hotspot",
    // targetYaw/targetPitch/targetHfov are intentionally left unset: the
    // target scene's own initialYaw/initialPitch/initialHfov (from that
    // room's RoomConfig) is used instead, which is exactly the "initial
    // yaw/pitch/hfov" the data model already defines per room.
  }));
}

/** Converts a `RoomConfig` into a single Pannellum scene configuration. */
function toSceneConfig(room: RoomConfig): Pannellum.ConfigOptions {
  return {
    type: "equirectangular",
    panorama: room.image,
    title: room.title,
    yaw: room.initialYaw,
    pitch: room.initialPitch,
    hfov: room.initialHfov,
    hotSpots: toHotSpots(room),
    autoRotate: driftDirectionFor(room.id) * ENTRY_DRIFT_SPEED,
    autoRotateStopDelay: ENTRY_DRIFT_STOP_DELAY_MS,
  };
}

/**
 * Creates a Pannellum viewer inside `container`, registering every room in
 * `rooms` as a navigable scene and starting on `startRoomId`.
 *
 * Navigation between rooms is handled entirely by Pannellum's native
 * "scene" hotspot behaviour (no custom click handlers or floating HTML
 * buttons layered on top of the panorama).
 */
export function createTourViewer(
  container: HTMLElement,
  rooms: RoomConfig[],
  startRoomId: string
): Pannellum.Viewer {
  if (!rooms.some((room) => room.id === startRoomId)) {
    throw new Error(`createTourViewer: unknown start room id "${startRoomId}"`);
  }

  const tourConfig: PannellumTourConfig = {
    default: {
      firstScene: startRoomId,
      autoLoad: true,
      compass: false,
      showFullscreenCtrl: false,
      sceneFadeDuration: 600,
    },
    scenes: Object.fromEntries(rooms.map((room) => [room.id, toSceneConfig(room)])),
  };

  // `@types/pannellum` only types single-scene ConfigOptions, so the
  // multi-scene tour shape (verified against Pannellum's actual runtime
  // source, see the module doc comment above) needs an explicit cast here.
  return window.pannellum.viewer(container, tourConfig as unknown as Pannellum.ConfigOptions);
}


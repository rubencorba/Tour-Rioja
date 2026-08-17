/**
 * Core data model for the virtual tour.
 *
 * Every room in the house is described by a `RoomConfig` object, and every
 * `RoomConfig` is entirely self-contained: its panorama image, its starting
 * view, and the hotspots that connect it to other rooms.
 *
 * Adding a new room to the house never requires touching this file's shape,
 * only adding a new object that follows it (see `src/data/rooms.ts`).
 */

/** A single interactive hotspot rendered inside a panorama. */
export interface RoomHotspot {
  /** Id of the room this hotspot navigates to (must match a `RoomConfig.id`). */
  target: string;
  /** Yaw (horizontal angle, in degrees) at which the hotspot is placed. */
  yaw: number;
  /** Pitch (vertical angle, in degrees) at which the hotspot is placed. */
  pitch: number;
  /** Short text shown on hover, e.g. "Ir al Pasillo". */
  label: string;
}

/** Full configuration for a single 360° room/scene. */
export interface RoomConfig {
  /** Unique, stable identifier for the room. Used as the Pannellum scene id. */
  id: string;
  /** Human-readable title, e.g. "Comedor". */
  title: string;
  /** Imported panorama image (equirectangular, from src/assets/panoramas). */
  image: string;
  /** Initial yaw the viewer opens with when entering this room. */
  initialYaw: number;
  /** Initial pitch the viewer opens with when entering this room. */
  initialPitch: number;
  /** Initial horizontal field of view the viewer opens with. */
  initialHfov: number;
  /** Hotspots connecting this room to its neighbours. */
  hotspots: RoomHotspot[];
}

/** Map of room id -> room configuration, used for O(1) lookups. */
export type RoomMap = Record<string, RoomConfig>;

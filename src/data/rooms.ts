import type { RoomConfig, RoomMap } from "../types/room.types";

// Panorama images. These files are expected to exist at these exact paths;
// they are inserted manually after the app is scaffolded. Until then, Vite
// will fail to resolve them at dev/build time — that failure is expected
// and is not a bug in this configuration file.
import comedorImage from "../assets/panoramas/ComedorRioja.png";
import banioImage from "../assets/panoramas/BanioRioja.png";
import pasilloImage from "../assets/panoramas/PasilloRioja.png";
import dormitorio1Image from "../assets/panoramas/Dormitorio1Rioja.png";
import dormitorio2Image from "../assets/panoramas/Dormitorio2Rioja.png";

/**
 * THE CENTRALIZED TOUR CONFIGURATION.
 *
 * This array is the single source of truth for every room in the house and
 * every connection between them. Nothing in `components/`, `pages/`,
 * `hooks/`, or `services/` hardcodes a room id, an image, or a navigation
 * link — they all read from this file.
 *
 * ---------------------------------------------------------------------
 * HOW TO ADD A NEW ROOM (no application logic changes required):
 * ---------------------------------------------------------------------
 * 1. Drop the new equirectangular panorama into `src/assets/panoramas/`.
 * 2. Import it above, next to the other panorama imports.
 * 3. Add a new `RoomConfig` object to the array below with a unique `id`.
 * 4. Add a hotspot in the neighbouring room(s) that points `target` at the
 *    new room's `id`, and add hotspot(s) in the new room pointing back.
 * 5. That's it — the viewer, the router and the navigation graph are all
 *    derived from this file automatically.
 *
 * NOTE ON YAW/PITCH VALUES: the numbers below are reasonable starting
 * placeholders (front/back/left/right compass-style positions). Once the
 * real panoramas are in place, open each room in the viewer and nudge the
 * `yaw`/`pitch` of its hotspots until they sit exactly on the doorway or
 * hallway opening they represent.
 */
export const ROOMS: RoomConfig[] = [
  {
    id: "Comedor",
    title: "Comedor",
    image: comedorImage,
    initialYaw: 0,
    initialPitch: 0,
    initialHfov: 120,
    hotspots: [
      {
        target: "Pasillo",
        yaw: 115,
        pitch: -2,
        label: "Ir al Pasillo",
      },
    ],
  },
  {
    id: "Pasillo",
    title: "Pasillo",
    image: pasilloImage,
    initialYaw: 0,
    initialPitch: 0,
    initialHfov: 120,
    hotspots: [
      {
        target: "Comedor",
        yaw: 40,
        pitch: -2,
        label: "Ir al Comedor",
      },
      {
        target: "Baño",
        yaw: 130,
        pitch: -3,
        label: "Ir al Baño",
      },
      {
        target: "Dormitorio1",
        yaw: -70,
        pitch: -2,
        label: "Ir al Dormitorio 1",
      },
      {
        target: "Dormitorio2",
        yaw: -125,
        pitch: -2,
        label: "Ir al Dormitorio 2",
      },
    ],
  },
  {
    id: "Baño",
    title: "Baño",
    image: banioImage,
    initialYaw: 0,
    initialPitch: 0,
    initialHfov: 120,
    hotspots: [
      {
        target: "Pasillo",
        yaw: 0,
        pitch: -2,
        label: "Volver al Pasillo",
      },
    ],
  },
  {
    id: "Dormitorio1",
    title: "Dormitorio 1",
    image: dormitorio1Image,
    initialYaw: 0,
    initialPitch: 0,
    initialHfov: 120,
    hotspots: [
      {
        target: "Pasillo",
        yaw: 5,
        pitch: -2,
        label: "Volver al Pasillo",
      },
    ],
  },
  {
    id: "Dormitorio2",
    title: "Dormitorio 2",
    image: dormitorio2Image,
    initialYaw: 0,
    initialPitch: 0,
    initialHfov: 120,
    hotspots: [
      {
        target: "Pasillo",
        yaw: 67,
        pitch: 0,
        label: "Volver al Pasillo",
      },
    ],
  },
];

/** `ROOMS` indexed by id, for O(1) lookups from anywhere in the app. */
export const ROOM_MAP: RoomMap = ROOMS.reduce((map, room) => {
  map[room.id] = room;
  return map;
}, {} as RoomMap);

/** The room the tour opens on when the visitor presses "Go Home". */
export const ENTRY_ROOM_ID: string = "Comedor";

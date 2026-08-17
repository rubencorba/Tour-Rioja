import type { RoomConfig } from "../types/room.types";
import { usePannellumViewer } from "../hooks/usePannellumViewer";

interface PanoramaViewerProps {
  rooms: RoomConfig[];
  startRoomId: string;
}

/**
 * Renders the 360° panorama viewer. All navigation between rooms happens
 * through hotspots rendered inside the panorama by Pannellum itself — this
 * component does not render any floating navigation buttons.
 */
export function PanoramaViewer({ rooms, startRoomId }: PanoramaViewerProps) {
  const { containerRef, /* currentRoomId, */ isLoading } = usePannellumViewer(rooms, startRoomId);
  /* const currentRoom = rooms.find((room) => room.id === currentRoomId); */

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      {/* {currentRoom && (
        <div className="pointer-events-none absolute left-4 top-4 z-10 border-l-2 border-brass bg-blueprint-dim/85 px-3 py-2 font-mono text-xs uppercase tracking-[0.15em] text-paper">
          {currentRoom.title}
        </div>
      )} */}

      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-blueprint-dim">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-light">
            Cargando plano&hellip;
          </p>
        </div>
      )}
    </div>
  );
}

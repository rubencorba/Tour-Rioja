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
  const { containerRef, isLoading } = usePannellumViewer(rooms, startRoomId);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

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

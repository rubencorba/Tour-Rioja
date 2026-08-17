import { useEffect, useRef, useState } from "react";
import type { RoomConfig } from "../types/room.types";
import { createTourViewer } from "../services/pannellumService";

interface UsePannellumViewerResult {
  /** Attach this to the element that should host the panorama. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Id of the room currently being displayed. */
  currentRoomId: string;
  /** True until the first panorama has finished loading. */
  isLoading: boolean;
}

/**
 * Mounts a Pannellum tour viewer for the given `rooms` on mount, keeps
 * `currentRoomId` in sync as the visitor moves between scenes via hotspots,
 * and destroys the viewer on unmount.
 */
export function usePannellumViewer(
  rooms: RoomConfig[],
  startRoomId: string
): UsePannellumViewerResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string>(startRoomId);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setIsLoading(true);
    const viewer = createTourViewer(container, rooms, startRoomId);

    const handleSceneChange = (sceneId: string) => setCurrentRoomId(sceneId);
    const handleLoad = () => setIsLoading(false);

    viewer.on("scenechange", handleSceneChange);
    viewer.on("load", handleLoad);

    return () => {
      viewer.off("scenechange", handleSceneChange);
      viewer.off("load", handleLoad);
      viewer.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms, startRoomId]);

  return { containerRef, currentRoomId, isLoading };
}

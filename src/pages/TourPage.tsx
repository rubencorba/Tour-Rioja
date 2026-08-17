import { ROOMS, ENTRY_ROOM_ID } from "../data/rooms";
import { PanoramaViewer } from "../components/PanoramaViewer";
import { RotateDevicePrompt } from "../components/RotateDevicePrompt";
import { useOrientationGuard } from "../hooks/useOrientationGuard";

/**
 * Tour page: the house itself. Rooms and their connections come entirely
 * from `data/rooms.ts` — this component knows nothing about how many
 * rooms exist or how they connect.
 */
export function TourPage() {
  const shouldPromptRotate = useOrientationGuard();

  return (
    <div className="relative h-full w-full bg-blueprint-dim">
      <PanoramaViewer rooms={ROOMS} startRoomId={ENTRY_ROOM_ID} />
      {shouldPromptRotate && <RotateDevicePrompt />}
    </div>
  );
}

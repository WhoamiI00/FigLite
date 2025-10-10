import { useEffect } from "react";
import { useOthers } from "@/liveblocks.config";
import { RoomStorageManager } from "@/lib/room-storage";

/**
 * Hook to track user presence and update room participant count
 */
export function useRoomPresence(roomCode: string) {
  const others = useOthers();
  const participantCount = others.length + 1; // +1 for current user

  useEffect(() => {
    // Update participant count in room storage
    RoomStorageManager.updateParticipantCount(roomCode, participantCount);
  }, [participantCount, roomCode]);

  return { participantCount };
}

import { RoomStorageManager } from "./room-storage";
import { RoomCleanupService } from "./room-cleanup";

/**
 * Service to monitor room participant changes and trigger cleanup when rooms become empty
 */
export class RoomParticipantMonitor {
  private static participantCounts = new Map<string, number>();
  private static emptyRoomTimers = new Map<string, NodeJS.Timeout>();

  /**
   * Updates participant count for a room and handles empty room logic
   */
  static updateParticipantCount(roomCode: string, count: number): void {
    const previousCount = this.participantCounts.get(roomCode) || 0;
    this.participantCounts.set(roomCode, count);

    // Update the room in storage
    RoomStorageManager.updateParticipantCount(roomCode, count);

    // Handle transitions
    if (previousCount > 0 && count === 0) {
      // Room just became empty
      this.onRoomBecameEmpty(roomCode);
    } else if (previousCount === 0 && count > 0) {
      // Room is no longer empty
      this.onRoomBecameOccupied(roomCode);
    }

    console.log(
      `📊 Room ${roomCode}: ${count} participants (was ${previousCount})`
    );
  }

  /**
   * Called when a room becomes empty (transitions from having participants to 0)
   */
  private static onRoomBecameEmpty(roomCode: string): void {
    // Get room info to check if it's sustained
    const room = RoomStorageManager.getRoom(roomCode);
    if (!room) return;

    if (room.isSustained) {
      console.log(`⏸️ Sustained room ${roomCode} became empty - will preserve`);
      return;
    }

    console.log(
      `⏰ Room ${roomCode} became empty - starting 10-minute cleanup timer`
    );

    // Set a timer to clean up the room after 10 minutes if it remains empty
    const timer = setTimeout(
      () => {
        const currentRoom = RoomStorageManager.getRoom(roomCode);
        if (
          currentRoom &&
          currentRoom.participantCount === 0 &&
          !currentRoom.isSustained
        ) {
          console.log(
            `🧹 Auto-cleaning empty room ${roomCode} after 10 minutes`
          );

          // Update last activity to mark when it became eligible for cleanup
          RoomStorageManager.updateRoom(roomCode, { lastActivity: new Date() });

          // Trigger immediate cleanup check
          RoomCleanupService.runCleanup();
        }

        // Clean up the timer
        this.emptyRoomTimers.delete(roomCode);
      },
      10 * 60 * 1000
    ); // 10 minutes

    // Store the timer so we can cancel it if the room becomes occupied again
    this.emptyRoomTimers.set(roomCode, timer);
  }

  /**
   * Called when a room becomes occupied (transitions from 0 to having participants)
   */
  private static onRoomBecameOccupied(roomCode: string): void {
    console.log(
      `👥 Room ${roomCode} became occupied - canceling cleanup timer`
    );

    // Cancel any pending cleanup timer
    const timer = this.emptyRoomTimers.get(roomCode);
    if (timer) {
      clearTimeout(timer);
      this.emptyRoomTimers.delete(roomCode);
    }

    // Update room activity
    RoomStorageManager.updateRoom(roomCode, { lastActivity: new Date() });
  }

  /**
   * Gets current participant count for a room
   */
  static getParticipantCount(roomCode: string): number {
    return this.participantCounts.get(roomCode) || 0;
  }

  /**
   * Removes a room from monitoring (when room is deleted)
   */
  static stopMonitoring(roomCode: string): void {
    // Cancel any pending timer
    const timer = this.emptyRoomTimers.get(roomCode);
    if (timer) {
      clearTimeout(timer);
      this.emptyRoomTimers.delete(roomCode);
    }

    // Remove from participant tracking
    this.participantCounts.delete(roomCode);

    console.log(`🚫 Stopped monitoring room ${roomCode}`);
  }

  /**
   * Cleans up all monitoring data (for page unload)
   */
  static cleanup(): void {
    // Cancel all timers
    this.emptyRoomTimers.forEach((timer) => {
      clearTimeout(timer);
    });

    // Clear all data
    this.emptyRoomTimers.clear();
    this.participantCounts.clear();

    console.log("🧹 Cleaned up room participant monitoring");
  }
}

// Auto-cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    RoomParticipantMonitor.cleanup();
  });
}

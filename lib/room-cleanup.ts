import { RoomStorageManager } from "./room-storage";
import { RoomKeepaliveService } from "./room-keepalive";

/**
 * Room cleanup service that periodically removes expired rooms
 */
export class RoomCleanupService {
  private static interval: NodeJS.Timeout | null = null;
  private static isRunning = false;

  /**
   * Starts the cleanup service
   */
  static start(intervalMinutes: number = 10): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    // Run cleanup immediately
    this.runCleanup();

    // Set up recurring cleanup
    this.interval = setInterval(
      () => {
        this.runCleanup();
      },
      intervalMinutes * 60 * 1000
    );

    console.log(
      `Room cleanup service started (running every ${intervalMinutes} minutes)`
    );
  }

  /**
   * Stops the cleanup service
   */
  static stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log("Room cleanup service stopped");
  }

  /**
   * Runs a single cleanup cycle
   */
  static runCleanup(): void {
    try {
      const cleanupResult = RoomStorageManager.cleanupExpiredRooms();

      // Stop keepalive services for deleted rooms
      cleanupResult.deleted.forEach((roomInfo) => {
        const roomId = `neolive-${roomInfo.code.toLowerCase()}`;
        RoomKeepaliveService.stopKeepalive(roomId);
      });

      if (cleanupResult.deleted.length > 0) {
        console.log("🧹 Room cleanup completed:");
        cleanupResult.deleted.forEach((roomInfo) => {
          console.log(`  - ${roomInfo.code}: ${roomInfo.reason}`);
        });
      }

      // Log sustained rooms status
      const activeRooms = RoomStorageManager.getActiveRooms();
      const sustainedRooms = activeRooms.filter((room) => room.isSustained);
      const emptyRooms = activeRooms.filter(
        (room) => room.participantCount === 0
      );

      console.log(`📊 Room status: ${activeRooms.length} active rooms`);
      if (sustainedRooms.length > 0) {
        console.log(`  - ${sustainedRooms.length} sustained rooms preserved`);
      }
      if (emptyRooms.length > 0) {
        const nonSustainedEmpty = emptyRooms.filter(
          (room) => !room.isSustained
        );
        if (nonSustainedEmpty.length > 0) {
          console.log(
            `  - ${nonSustainedEmpty.length} empty rooms (will cleanup after 10min)`
          );
        }
      }
    } catch (error) {
      console.error("Error during room cleanup:", error);
    }
  }

  /**
   * Checks if the service is running
   */
  static isServiceRunning(): boolean {
    return this.isRunning;
  }
}

// Auto-start cleanup service in browser environment
if (typeof window !== "undefined") {
  // Start cleanup service when module loads
  // Run every 5 minutes to catch empty rooms more quickly
  RoomCleanupService.start(5);

  // Stop cleanup service when page unloads
  window.addEventListener("beforeunload", () => {
    RoomCleanupService.stop();
  });
}

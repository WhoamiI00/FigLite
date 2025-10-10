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
      const deletedRooms = RoomStorageManager.cleanupExpiredRooms();

      // Stop keepalive services for deleted rooms
      deletedRooms.forEach((roomCode) => {
        const roomId = `figlite-${roomCode.toLowerCase()}`;
        RoomKeepaliveService.stopKeepalive(roomId);
      });

      if (deletedRooms.length > 0) {
        console.log(
          `Cleaned up ${deletedRooms.length} expired rooms:`,
          deletedRooms
        );
      }

      // Log sustained rooms status
      const activeRooms = RoomStorageManager.getActiveRooms();
      const sustainedRooms = activeRooms.filter((room) => room.isSustained);
      if (sustainedRooms.length > 0) {
        console.log(
          `${sustainedRooms.length} sustained rooms are being preserved:`,
          sustainedRooms.map((room) => room.code)
        );
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
  RoomCleanupService.start(10); // Run every 10 minutes

  // Stop cleanup service when page unloads
  window.addEventListener("beforeunload", () => {
    RoomCleanupService.stop();
  });
}

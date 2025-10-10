import { RoomStorageManager } from "./room-storage";
import { createClient } from "@liveblocks/client";

/**
 * Service that keeps sustained rooms alive by maintaining phantom connections
 * This prevents Liveblocks from destroying rooms when all users leave
 */
export class RoomKeepaliveService {
  private static instances: Map<string, any> = new Map();
  private static client: any = null;

  /**
   * Initialize the Liveblocks client for keepalive connections
   */
  private static initClient() {
    if (!this.client) {
      this.client = createClient({
        publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!,
        throttle: 16,
      });
    }
    return this.client;
  }

  /**
   * Start keepalive for a sustained room
   */
  static startKeepalive(roomId: string, roomCode: string): void {
    if (this.instances.has(roomId)) {
      return; // Already running
    }

    console.log(`Starting keepalive for room: ${roomCode} (${roomId})`);

    const client = this.initClient();

    // Create a phantom room connection that keeps the room alive
    const room = client.enter(roomId, {
      initialPresence: { isKeepalive: true },
      initialStorage: {},
    });

    // Set up periodic activity to prevent timeout
    const interval = setInterval(
      () => {
        // Check if room is still sustained
        const roomData = RoomStorageManager.getRoom(roomCode);

        if (!roomData || !roomData.isSustained) {
          console.log(
            `Room ${roomCode} no longer sustained, stopping keepalive`
          );
          this.stopKeepalive(roomId);
          return;
        }

        // Check if room has expired
        const now = new Date();
        if (roomData.sustainedUntil && now > roomData.sustainedUntil) {
          console.log(`Room ${roomCode} has expired, stopping keepalive`);
          this.stopKeepalive(roomId);
          return;
        }

        // Send a heartbeat to keep the room alive
        try {
          room.updatePresence({ lastKeepalive: now.toISOString() });
        } catch (error) {
          console.error("Keepalive heartbeat failed:", error);
        }
      },
      5 * 60 * 1000
    ); // Every 5 minutes

    // Store the room and interval for cleanup
    this.instances.set(roomId, { room, interval });

    // Auto-cleanup when sustained period ends
    const roomData = RoomStorageManager.getRoom(roomCode);
    if (roomData && roomData.sustainedUntil) {
      const timeUntilExpiry = roomData.sustainedUntil.getTime() - Date.now();
      if (timeUntilExpiry > 0) {
        setTimeout(() => {
          this.stopKeepalive(roomId);
        }, timeUntilExpiry);
      }
    }
  }

  /**
   * Stop keepalive for a room
   */
  static stopKeepalive(roomId: string): void {
    const instance = this.instances.get(roomId);

    if (instance) {
      console.log(`Stopping keepalive for room: ${roomId}`);

      // Clear the interval
      clearInterval(instance.interval);

      // Leave the room
      try {
        instance.room.leave();
      } catch (error) {
        console.error("Error leaving keepalive room:", error);
      }

      // Remove from instances
      this.instances.delete(roomId);
    }
  }

  /**
   * Start keepalive service - check for existing sustained rooms
   */
  static startService(): void {
    console.log("Starting Room Keepalive Service");

    // Check for existing sustained rooms and start keepalive
    const activeRooms = RoomStorageManager.getActiveRooms();

    activeRooms.forEach((room) => {
      if (room.isSustained && room.sustainedUntil) {
        const now = new Date();
        if (now < room.sustainedUntil) {
          this.startKeepalive(room.id, room.code);
        }
      }
    });

    // Periodic check for new sustained rooms
    setInterval(() => {
      const currentRooms = RoomStorageManager.getActiveRooms();

      currentRooms.forEach((room) => {
        if (room.isSustained && room.sustainedUntil) {
          const now = new Date();
          if (now < room.sustainedUntil && !this.instances.has(room.id)) {
            this.startKeepalive(room.id, room.code);
          }
        }
      });
    }, 60 * 1000); // Check every minute
  }

  /**
   * Stop all keepalive instances
   */
  static stopAllKeepalives(): void {
    console.log("Stopping all keepalive instances");

    for (const [roomId] of this.instances) {
      this.stopKeepalive(roomId);
    }
  }

  /**
   * Get active keepalive instances
   */
  static getActiveKeepalives(): string[] {
    return Array.from(this.instances.keys());
  }
}

// Auto-start the service in browser environment
if (typeof window !== "undefined") {
  // Start service when module loads
  RoomKeepaliveService.startService();

  // Stop all keepalives when page unloads
  window.addEventListener("beforeunload", () => {
    RoomKeepaliveService.stopAllKeepalives();
  });
}

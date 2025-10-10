import { Room } from "@/types/room";
import { shouldCleanupRoom } from "./room-utils";

const ROOMS_STORAGE_KEY = "figlite_rooms";
const USER_ROOMS_KEY = "figlite_user_rooms";

/**
 * Room storage manager using localStorage
 * Note: In production, replace with a proper database
 */
export class RoomStorageManager {
  /**
   * Saves a room to storage
   */
  static saveRoom(room: Room): void {
    const rooms = this.getAllRooms();
    const serializedRoom = {
      ...room,
      createdAt: room.createdAt.toISOString(),
      expiresAt: room.expiresAt.toISOString(),
      sustainedUntil: room.sustainedUntil?.toISOString(),
      lastActivity: room.lastActivity.toISOString(),
    };

    rooms[room.code] = serializedRoom;

    console.log("Saving room to localStorage:", room.code, serializedRoom);

    if (typeof window !== "undefined") {
      localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
      console.log(
        "Successfully saved to localStorage. Current storage:",
        localStorage.getItem(ROOMS_STORAGE_KEY)
      );
    } else {
      console.error("Window is undefined, cannot save to localStorage");
    }
  }

  /**
   * Gets a room by code
   */
  static getRoom(code: string): Room | null {
    const rooms = this.getAllRooms();
    console.log("Getting room:", code, "Available rooms:", Object.keys(rooms));

    const roomData = rooms[code];

    if (!roomData) {
      console.log("Room data not found for code:", code);
      return null;
    }

    console.log("Found room data:", roomData);
    const room = this.deserializeRoom(roomData);

    // Check if room should be cleaned up
    if (shouldCleanupRoom(room)) {
      console.log("Room should be cleaned up:", code);
      this.deleteRoom(code);
      return null;
    }

    console.log("Returning room:", room);
    return room;
  }

  /**
   * Gets all rooms from storage
   */
  static getAllRooms(): Record<string, any> {
    if (typeof window === "undefined") {
      console.log("Window is undefined in getAllRooms");
      return {};
    }

    const data = localStorage.getItem(ROOMS_STORAGE_KEY);
    console.log("Raw localStorage data:", data);
    return data ? JSON.parse(data) : {};
  }

  /**
   * Gets all active rooms (not expired)
   */
  static getActiveRooms(): Room[] {
    const rooms = this.getAllRooms();
    const activeRooms: Room[] = [];

    for (const [code, roomData] of Object.entries(rooms)) {
      const room = this.deserializeRoom(roomData);

      if (shouldCleanupRoom(room)) {
        this.deleteRoom(code);
        continue;
      }

      activeRooms.push(room);
    }

    return activeRooms;
  }

  /**
   * Updates an existing room
   */
  static updateRoom(code: string, updates: Partial<Room>): Room | null {
    const room = this.getRoom(code);

    if (!room) {
      return null;
    }

    const updatedRoom = { ...room, ...updates };
    this.saveRoom(updatedRoom);
    return updatedRoom;
  }

  /**
   * Deletes a room from storage
   */
  static deleteRoom(code: string): void {
    const rooms = this.getAllRooms();
    delete rooms[code];

    if (typeof window !== "undefined") {
      localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
    }
  }

  /**
   * Cleans up expired rooms
   */
  static cleanupExpiredRooms(): string[] {
    const rooms = this.getAllRooms();
    const deletedRooms: string[] = [];

    for (const [code, roomData] of Object.entries(rooms)) {
      const room = this.deserializeRoom(roomData);

      if (shouldCleanupRoom(room)) {
        this.deleteRoom(code);
        deletedRooms.push(code);
      }
    }

    return deletedRooms;
  }

  /**
   * Associates a room with a user
   */
  static addUserRoom(userId: string, roomCode: string): void {
    if (typeof window === "undefined") return;

    const userRooms = this.getUserRooms(userId);
    if (!userRooms.includes(roomCode)) {
      userRooms.push(roomCode);
      localStorage.setItem(
        `${USER_ROOMS_KEY}_${userId}`,
        JSON.stringify(userRooms)
      );
    }
  }

  /**
   * Gets rooms associated with a user
   */
  static getUserRooms(userId: string): string[] {
    if (typeof window === "undefined") return [];

    const data = localStorage.getItem(`${USER_ROOMS_KEY}_${userId}`);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Removes a room association from a user
   */
  static removeUserRoom(userId: string, roomCode: string): void {
    if (typeof window === "undefined") return;

    const userRooms = this.getUserRooms(userId).filter(
      (code) => code !== roomCode
    );
    localStorage.setItem(
      `${USER_ROOMS_KEY}_${userId}`,
      JSON.stringify(userRooms)
    );
  }

  /**
   * Updates room participant count
   */
  static updateParticipantCount(code: string, count: number): void {
    this.updateRoom(code, {
      participantCount: count,
      lastActivity: new Date(),
    });
  }

  /**
   * Helper to deserialize room data from storage
   */
  private static deserializeRoom(roomData: any): Room {
    return {
      ...roomData,
      createdAt: new Date(roomData.createdAt),
      expiresAt: new Date(roomData.expiresAt),
      sustainedUntil: roomData.sustainedUntil
        ? new Date(roomData.sustainedUntil)
        : undefined,
      lastActivity: new Date(roomData.lastActivity),
    };
  }
}

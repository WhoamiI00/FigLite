import {
  Room,
  RoomSettings,
  CreateRoomRequest,
  DEFAULT_ROOM_SETTINGS,
} from "@/types/room";

/**
 * Generates a unique room code (6 characters, alphanumeric)
 */
export function generateRoomCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generates a unique room ID for Liveblocks
 */
export function generateRoomId(code: string): string {
  return `neolive-${code.toLowerCase()}`;
}

/**
 * Creates a new room with the specified settings
 */
export function createRoom(request: CreateRoomRequest): Room {
  const code = generateRoomCode();
  const now = new Date();
  const settings = { ...DEFAULT_ROOM_SETTINGS, ...request.settings };

  const room: Room = {
    id: generateRoomId(code),
    code,
    createdAt: now,
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours from now
    isSustained: settings.isSustained,
    sustainedUntil: settings.isSustained
      ? new Date(now.getTime() + settings.sustainDuration * 60 * 60 * 1000)
      : undefined,
    lastActivity: now,
    creatorId: request.creatorId || generateUserId(),
    isActive: true,
    participantCount: 0,
  };

  return room;
}

/**
 * Generates a temporary user ID for anonymous users
 */
export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Checks if a room is expired
 */
export function isRoomExpired(room: Room): boolean {
  const now = new Date();

  // If room is sustained, check sustained time
  if (room.isSustained && room.sustainedUntil) {
    return now > room.sustainedUntil;
  }

  // Otherwise check regular expiry
  return now > room.expiresAt;
}

/**
 * Checks if a room should be cleaned up due to inactivity
 */
export function shouldCleanupRoom(room: Room): boolean {
  const now = new Date();

  // Don't cleanup sustained rooms that are still within their sustained period
  if (room.isSustained && room.sustainedUntil && now < room.sustainedUntil) {
    return false;
  }

  // First check if the room is actually expired (24 hours)
  if (isRoomExpired(room)) {
    return true;
  }

  // For non-sustained rooms, check if empty for 10 minutes
  if (!room.isSustained) {
    // If no participants and inactive for 10 minutes, cleanup
    if (room.participantCount === 0) {
      const emptyRoomThreshold = 10 * 60 * 1000; // 10 minutes in ms
      const inactiveTime = now.getTime() - room.lastActivity.getTime();

      // Only apply 10-minute rule if room is older than 2 minutes (grace period for new rooms)
      const roomAge = now.getTime() - room.createdAt.getTime();
      const graceTime = 2 * 60 * 1000; // 2 minutes

      if (roomAge > graceTime && inactiveTime > emptyRoomThreshold) {
        return true;
      }
    }
  }

  // For sustained rooms that have expired their sustained period,
  // use longer inactivity threshold (2 hours)
  if (room.isSustained && room.sustainedUntil && now > room.sustainedUntil) {
    const extendedInactiveThreshold = 2 * 60 * 60 * 1000; // 2 hours in ms
    return (
      now.getTime() - room.lastActivity.getTime() > extendedInactiveThreshold
    );
  }

  return false;
}

/**
 * Updates room activity timestamp
 */
export function updateRoomActivity(room: Room): Room {
  return {
    ...room,
    lastActivity: new Date(),
  };
}

/**
 * Sustains a room for the specified duration
 */
export function sustainRoom(room: Room, durationHours: number = 24): Room {
  const now = new Date();
  return {
    ...room,
    isSustained: true,
    sustainedUntil: new Date(now.getTime() + durationHours * 60 * 60 * 1000),
    lastActivity: now,
  };
}

/**
 * Formats room expiry time for display
 */
export function formatRoomExpiry(room: Room): string {
  const expiryTime =
    room.isSustained && room.sustainedUntil
      ? room.sustainedUntil
      : room.expiresAt;
  const now = new Date();
  const diffMs = expiryTime.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "Expired";
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m remaining`;
  } else {
    return `${diffMinutes}m remaining`;
  }
}

/**
 * Checks if an empty room should be deleted (10-minute rule for non-sustained rooms)
 */
export function shouldCleanupEmptyRoom(room: Room): boolean {
  // Only applies to non-sustained rooms
  if (room.isSustained) {
    return false;
  }

  // Must have no participants
  if (room.participantCount > 0) {
    return false;
  }

  const now = new Date();
  const emptyDuration = now.getTime() - room.lastActivity.getTime();
  const roomAge = now.getTime() - room.createdAt.getTime();

  // Grace period: Don't cleanup very new rooms (2 minutes)
  const graceTime = 2 * 60 * 1000;
  if (roomAge < graceTime) {
    return false;
  }

  // Cleanup threshold: 10 minutes without participants
  const cleanupThreshold = 10 * 60 * 1000;
  return emptyDuration > cleanupThreshold;
}

/**
 * Gets the cleanup reason for a room (for logging)
 */
export function getCleanupReason(room: Room): string {
  const now = new Date();

  if (isRoomExpired(room)) {
    return room.isSustained
      ? "Sustained period expired (24h)"
      : "Room expired (24h)";
  }

  if (shouldCleanupEmptyRoom(room)) {
    return "Empty room (10min timeout)";
  }

  if (room.isSustained && room.sustainedUntil && now > room.sustainedUntil) {
    const inactiveTime = now.getTime() - room.lastActivity.getTime();
    const threshold = 2 * 60 * 60 * 1000; // 2 hours
    if (inactiveTime > threshold) {
      return "Sustained room inactive (2h)";
    }
  }

  return "Unknown";
}

/**
 * Creates a shareable room URL
 */
export function createShareableUrl(roomCode: string, baseUrl?: string): string {
  const base =
    baseUrl ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");
  return `${base}/room/${roomCode}`;
}

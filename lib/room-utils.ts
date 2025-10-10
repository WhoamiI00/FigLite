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
  return `figlite-${code.toLowerCase()}`;
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
  const inactiveThreshold = 2 * 60 * 60 * 1000; // 2 hours in ms

  // Don't cleanup sustained rooms
  if (room.isSustained && room.sustainedUntil && now < room.sustainedUntil) {
    return false;
  }

  // First check if the room is actually expired
  if (isRoomExpired(room)) {
    return true;
  }

  // Only check inactivity for rooms older than 5 minutes (to prevent cleanup of newly created rooms)
  const roomAge = now.getTime() - room.createdAt.getTime();
  const minRoomAge = 5 * 60 * 1000; // 5 minutes

  if (roomAge < minRoomAge) {
    return false; // Don't cleanup very new rooms
  }

  // Check if inactive for too long
  return now.getTime() - room.lastActivity.getTime() > inactiveThreshold;
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

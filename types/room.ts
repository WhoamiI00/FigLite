export interface Room {
  id: string;
  code: string;
  createdAt: Date;
  expiresAt: Date;
  isSustained: boolean;
  sustainedUntil?: Date;
  lastActivity: Date;
  creatorId: string;
  isActive: boolean;
  participantCount: number;
}

export interface RoomSettings {
  isSustained: boolean;
  sustainDuration: number; // in hours
}

export interface CreateRoomRequest {
  creatorId?: string;
  settings?: RoomSettings;
}

export interface JoinRoomRequest {
  roomCode: string;
  userId?: string;
}

export const DEFAULT_ROOM_SETTINGS: RoomSettings = {
  isSustained: false,
  sustainDuration: 24, // 24 hours default
};

export const ROOM_EXPIRY_HOURS = 24;
export const INACTIVE_ROOM_CLEANUP_HOURS = 2; // Clean up rooms inactive for 2+ hours (unless sustained)

"use client";

import { useState, useEffect } from "react";
import { Users, Share2, Zap, Clock } from "lucide-react";
import { useOthers } from "@/liveblocks.config";
import { Button } from "@/components/ui/button";
import ShareRoomModal from "./ShareRoomModal";
import { RoomStorageManager } from "@/lib/room-storage";
import { Room } from "@/types/room";
import {
  sustainRoom,
  formatRoomExpiry,
  createRoom,
  generateUserId,
  generateRoomId,
} from "@/lib/room-utils";
import { RoomKeepaliveService } from "@/lib/room-keepalive";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RoomInfoProps {
  roomCode: string;
}

export default function RoomInfo({ roomCode }: RoomInfoProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const others = useOthers();
  const participantCount = others.length + 1; // +1 for current user

  // Initialize or get existing room data
  useEffect(() => {
    let currentRoom = RoomStorageManager.getRoom(roomCode);

    if (!currentRoom) {
      // Create new room metadata if it doesn't exist
      currentRoom = createRoom({
        creatorId: generateUserId(),
      });
      currentRoom.code = roomCode; // Use the provided room code
      RoomStorageManager.saveRoom(currentRoom);

      // Mark as creator and save user ID
      localStorage.setItem("figlite_user_id", currentRoom.creatorId);
      setIsCreator(true);
    } else {
      // Check if current user is the creator
      const userId = localStorage.getItem("figlite_user_id");
      setIsCreator(userId === currentRoom.creatorId);
    }

    setRoom(currentRoom);

    // Update participant count
    RoomStorageManager.updateParticipantCount(roomCode, participantCount);
  }, [roomCode, participantCount]);

  // Refresh room data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedRoom = RoomStorageManager.getRoom(roomCode);
      if (updatedRoom) {
        setRoom(updatedRoom);
      }
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [roomCode]);

  const handleSustainRoom = () => {
    if (!room) return;

    const sustainedRoom = sustainRoom(room, 24);
    RoomStorageManager.saveRoom(sustainedRoom);
    setRoom(sustainedRoom);

    // Start keepalive service for this room
    const roomId = generateRoomId(roomCode);
    RoomKeepaliveService.startKeepalive(roomId, roomCode);

    // Show confirmation
    alert(
      "Room sustained for 24 hours! Canvas data will be preserved even when no one is active."
    );
  };

  return (
    <div className='fixed right-4 top-4 z-50'>
      <div className='rounded-lg border border-primary-grey-100 bg-primary-black/90 p-3 text-white shadow-lg backdrop-blur-sm'>
        <div className='flex items-center space-x-3'>
          {/* Room Code */}
          <div className='flex items-center space-x-2'>
            <div className='rounded bg-primary-grey-100 px-2 py-1 font-mono text-sm'>
              {roomCode}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowShareModal(true)}
                  className='h-6 w-6 p-0 hover:bg-primary-grey-100'
                >
                  <Share2 size={12} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share room</TooltipContent>
            </Tooltip>
          </div>

          {/* Participant Count */}
          <div className='flex items-center space-x-1 text-xs text-primary-grey-300'>
            <Users size={12} />
            <span>{participantCount}</span>
          </div>

          {/* Room Status & Expiry */}
          {room && (
            <div className='flex items-center space-x-1 text-xs'>
              <Clock size={12} />
              <span
                className={
                  room.isSustained
                    ? "text-primary-green"
                    : "text-primary-grey-300"
                }
              >
                {formatRoomExpiry(room)}
              </span>
            </div>
          )}

          {/* Sustain Button (for creators only) */}
          {isCreator && room && !room.isSustained && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleSustainRoom}
                  className='h-6 w-6 p-0 text-primary-green hover:bg-primary-green/20'
                >
                  <Zap size={12} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sustain room for 24h</TooltipContent>
            </Tooltip>
          )}

          {/* Sustained Indicator */}
          {room && room.isSustained && (
            <div className='flex items-center space-x-1'>
              <Zap size={12} className='text-primary-green' />
              <span className='text-xs text-primary-green'>Sustained</span>
            </div>
          )}

          {/* Live indicator */}
          <div className='flex items-center space-x-1'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-primary-green'></div>
            <span className='text-xs text-primary-green'>Live</span>
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareRoomModal
          roomCode={roomCode}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}

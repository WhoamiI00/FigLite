"use client";

import { useState, useEffect } from "react";
import { Users, Share2, Zap, Clock } from "lucide-react";
import { useOthers, useStorage, useMutation } from "@/liveblocks.config";
import { Button } from "@/components/ui/button";
import ShareRoomModal from "./ShareRoomModal";
import { getUserName } from "@/lib/user-utils";
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
  const others = useOthers();
  const participantCount = others.length + 1; // +1 for current user

  // Get room settings from Liveblocks storage (shared across all users)
  const roomSettings = useStorage((root) => root.roomSettings);

  // Mutation to update room sustain status
  const updateRoomSettings = useMutation(
    ({ storage }, updates: Partial<typeof roomSettings>) => {
      const currentSettings = storage.get("roomSettings");
      if (currentSettings) {
        Object.assign(currentSettings, updates);
      }
    },
    []
  );

  const handleSustainRoom = () => {
    if (!roomSettings) return;

    const now = new Date();
    const sustainedUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
    const userName = getUserName();

    // Update room settings in shared storage
    updateRoomSettings({
      isSustained: true,
      sustainedUntil: sustainedUntil.toISOString(),
      sustainedBy: userName,
      lastSustainedAt: now.toISOString(),
    });

    // Show confirmation
    const action = roomSettings.isSustained ? "extended" : "sustained";
    alert(
      `Room ${action} for 24 hours by ${userName}! Canvas data will be preserved even when no one is active.`
    );
  };

  // Helper function to format the remaining time
  const formatTimeRemaining = () => {
    if (!roomSettings) return "Loading...";

    const now = new Date();
    let expiryTime: Date;

    if (roomSettings.isSustained && roomSettings.sustainedUntil) {
      expiryTime = new Date(roomSettings.sustainedUntil);
    } else {
      // Default room expiry (24 hours from creation)
      expiryTime = new Date(
        new Date(roomSettings.createdAt).getTime() + 24 * 60 * 60 * 1000
      );
    }

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
  };

  // Check if user can extend (only when less than 1 hour remaining)
  const canExtendRoom = () => {
    if (!roomSettings) return false;

    const now = new Date();
    let expiryTime: Date;

    if (roomSettings.isSustained && roomSettings.sustainedUntil) {
      expiryTime = new Date(roomSettings.sustainedUntil);
    } else {
      expiryTime = new Date(
        new Date(roomSettings.createdAt).getTime() + 24 * 60 * 60 * 1000
      );
    }

    const diffMs = expiryTime.getTime() - now.getTime();
    const oneHourMs = 60 * 60 * 1000;

    return diffMs > 0 && diffMs <= oneHourMs; // Can extend when less than 1 hour remaining
  };

  return (
    <div className='flex flex-col gap-3 border-t border-primary-grey-200 px-5 py-3'>
      <h3 className='text-[10px] uppercase'>Room Info</h3>
      <div className='space-y-3'>
        {/* Room Code and Share */}
        <div className='flex items-center justify-between'>
          <div className='rounded bg-primary-grey-100 px-2 py-1 font-mono text-xs'>
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
        <div className='flex items-center justify-between text-xs'>
          <span className='text-primary-grey-300'>Participants</span>
          <div className='flex items-center space-x-1 text-primary-grey-300'>
            <Users size={12} />
            <span>{participantCount}</span>
          </div>
        </div>

        {/* Room Status & Expiry */}
        {roomSettings && (
          <div className='flex items-center justify-between text-xs'>
            <span className='text-primary-grey-300'>Status</span>
            <div className='flex items-center space-x-1'>
              <Clock size={12} />
              <span
                className={
                  roomSettings.isSustained
                    ? "text-primary-green"
                    : participantCount === 1
                      ? "text-orange-400"
                      : "text-primary-grey-300"
                }
              >
                {roomSettings.isSustained
                  ? "Sustained"
                  : participantCount === 1
                    ? "Auto-cleanup 10min"
                    : "Active"}
              </span>
            </div>
          </div>
        )}

        {/* Expiry Time */}
        {roomSettings && (
          <div
            className={`text-xs ${canExtendRoom() ? "text-orange-400" : "text-primary-grey-300"}`}
          >
            {roomSettings.isSustained
              ? formatTimeRemaining()
              : participantCount === 1
                ? "Room will auto-delete if empty for 10 minutes"
                : formatTimeRemaining()}
            {canExtendRoom() && (
              <div className='mt-1 text-xs text-orange-400'>
                ⚠️ Less than 1 hour remaining - you can extend now!
              </div>
            )}
          </div>
        )}

        {/* Sustained By Info */}
        {roomSettings &&
          roomSettings.isSustained &&
          roomSettings.sustainedBy && (
            <div className='text-xs text-primary-grey-300'>
              Sustained by: {roomSettings.sustainedBy}
            </div>
          )}

        {/* Sustain Button (any user can sustain when less than 1 hour remaining) */}
        {roomSettings && (!roomSettings.isSustained || canExtendRoom()) && (
          <Button
            onClick={handleSustainRoom}
            variant='outline'
            className='w-full border border-primary-grey-100 text-xs hover:bg-primary-green hover:text-primary-black'
          >
            <Zap size={12} className='mr-1' />
            {roomSettings.isSustained
              ? "Extend Room (24h)"
              : "Sustain Room (24h)"}
          </Button>
        )}

        {/* Sustained Indicator */}
        {roomSettings && roomSettings.isSustained && !canExtendRoom() && (
          <div className='flex items-center justify-center space-x-1 text-xs text-primary-green'>
            <Zap size={12} />
            <span>Room Sustained</span>
          </div>
        )}

        {/* Live indicator */}
        <div className='flex items-center justify-center space-x-1 text-xs'>
          <div className='h-2 w-2 animate-pulse rounded-full bg-primary-green'></div>
          <span className='text-primary-green'>Live</span>
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

"use client";

import { useEffect } from "react";
import { useOthers } from "@/liveblocks.config";
import { RoomParticipantMonitor } from "@/lib/room-participant-monitor";

interface ParticipantTrackerProps {
  roomCode: string;
}

/**
 * Component that tracks participant count changes and updates monitoring
 * Must be used inside a Liveblocks RoomProvider
 */
export default function ParticipantTracker({
  roomCode,
}: ParticipantTrackerProps) {
  const others = useOthers();

  useEffect(() => {
    // Count includes current user + others
    const participantCount = others.length + 1;

    console.log(
      `👥 Participant count for room ${roomCode}: ${participantCount}`
    );

    // Update the monitoring system
    RoomParticipantMonitor.updateParticipantCount(roomCode, participantCount);
  }, [others.length, roomCode]);

  // Clean up monitoring when component unmounts (user leaves room)
  useEffect(() => {
    return () => {
      // When this component unmounts, the user is leaving
      // Update count to exclude this user
      const participantCount = others.length;
      RoomParticipantMonitor.updateParticipantCount(roomCode, participantCount);
    };
  }, [others.length, roomCode]);

  return null; // This component doesn't render anything
}

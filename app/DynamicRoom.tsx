"use client";

import { LiveMap } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { useEffect } from "react";

import Loader from "@/components/Loader";
import ParticipantTracker from "@/components/ParticipantTracker";
import { RoomProvider } from "@/liveblocks.config";
import { RoomStorageManager } from "@/lib/room-storage";
import { RoomKeepaliveService } from "@/lib/room-keepalive";

interface DynamicRoomProps {
  roomId: string;
  roomCode: string;
  children: React.ReactNode;
}

const DynamicRoom = ({ roomId, roomCode, children }: DynamicRoomProps) => {
  useEffect(() => {
    // Check if this room is sustained and start keepalive if needed
    const room = RoomStorageManager.getRoom(roomCode);
    if (room && room.isSustained && room.sustainedUntil) {
      const now = new Date();
      if (now < room.sustainedUntil) {
        // Start keepalive to preserve room data
        RoomKeepaliveService.startKeepalive(roomId, roomCode);
      }
    }

    // Update room activity when component mounts
    if (room) {
      RoomStorageManager.updateRoom(roomCode, { lastActivity: new Date() });
    }
  }, [roomId, roomCode]);

  return (
    <RoomProvider
      id={roomId}
      /**
       * initialPresence is used to initialize the presence of the current
       * user in the room.
       *
       * initialPresence: https://liveblocks.io/docs/api-reference/liveblocks-react#RoomProvider
       */
      initialPresence={{
        cursor: null,
        message: "",
        userName: "",
        userId: "",
        isTyping: false,
      }}
      /**
       * initialStorage is used to initialize the storage of the room.
       *
       * initialStorage: https://liveblocks.io/docs/api-reference/liveblocks-react#RoomProvider
       */
      initialStorage={{
        /**
         * We're using a LiveMap to store the canvas objects and chat messages
         *
         * LiveMap: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap
         */
        canvasObjects: new LiveMap(),
        chatMessages: new LiveMap(),
        roomSettings: {
          isSustained: false,
          sustainedUntil: null,
          sustainedBy: null,
          createdAt: new Date().toISOString(),
          lastSustainedAt: null,
        },
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {() => (
          <>
            <ParticipantTracker roomCode={roomCode} />
            {children}
          </>
        )}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default DynamicRoom;

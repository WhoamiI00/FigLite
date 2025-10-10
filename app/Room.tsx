"use client";

import { LiveMap } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";

import Loader from "@/components/Loader";
import { RoomProvider } from "@/liveblocks.config";

const Room = ({
  children,
  roomId,
}: {
  children: React.ReactNode;
  roomId: string;
}) => {
  return (
    <RoomProvider
      id={roomId || "fig-room"}
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
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default Room;

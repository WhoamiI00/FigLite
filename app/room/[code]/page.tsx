"use client";

import { useParams } from "next/navigation";
import { generateRoomId } from "@/lib/room-utils";
import DynamicRoom from "../../DynamicRoom";
import dynamic from "next/dynamic";

// Dynamically import the canvas app to avoid SSR issues
const App = dynamic(() => import("../../App"), { ssr: false });

export default function RoomPage() {
  const params = useParams();
  const roomCode = (params.code as string)?.toUpperCase() || "";
  const roomId = generateRoomId(roomCode);

  // Validate room code format (6 alphanumeric characters)
  if (!roomCode || !/^[A-Z0-9]{6}$/.test(roomCode)) {
    return (
      <div className='flex h-screen flex-col items-center justify-center bg-primary-grey-200 text-white'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-bold'>Invalid Room Code</h1>
          <p className='mb-6 text-lg'>
            Room codes must be 6 characters long and contain only letters and
            numbers.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className='rounded-lg bg-primary-green px-6 py-3 text-primary-black transition-colors hover:bg-green-600'
          >
            Create New Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <DynamicRoom roomId={roomId} roomCode={roomCode}>
      <App roomId={roomId} roomCode={roomCode} />
    </DynamicRoom>
  );
}

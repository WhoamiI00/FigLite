"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateRoomCode } from "@/lib/room-utils";
import { Button } from "@/components/ui/button";
import JoinRoomModal from "@/components/JoinRoomModal";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleCreateRoom = () => {
    setLoading(true);

    try {
      // Generate a simple room code - Liveblocks will handle the rest
      const roomCode = generateRoomCode();

      console.log("Created room code:", roomCode);

      // Navigate to the room - Liveblocks will create it automatically
      router.push(`/room/${roomCode}`);
    } catch (error) {
      console.error("Failed to create room:", error);
      alert("Failed to create room. Please try again.");
      setLoading(false);
    }
  };

  const handleJoinRoom = () => {
    setShowJoinModal(true);
  };

  return (
    <div className='flex h-screen items-center justify-center bg-primary-grey-200'>
      <div className='space-y-8 p-8 text-center'>
        <div className='space-y-4'>
          <h1 className='text-4xl font-bold text-white'>Welcome to Figlite</h1>
          <p className='text-lg text-primary-grey-300'>
            Collaborative design made simple. Create or join a room to get
            started.
          </p>
        </div>

        <div className='space-y-4'>
          <Button
            onClick={handleCreateRoom}
            disabled={loading}
            className='w-full max-w-sm rounded-lg bg-primary-green px-8 py-4 text-lg text-primary-black transition-colors hover:bg-green-600'
          >
            {loading ? "Creating Room..." : "Create New Room"}
          </Button>

          <Button
            onClick={handleJoinRoom}
            variant='outline'
            className='w-full max-w-sm rounded-lg border-2 border-primary-grey-300 px-8 py-4 text-lg text-primary-grey-300 transition-colors hover:bg-primary-grey-300 hover:text-primary-grey-200'
          >
            Join Existing Room
          </Button>
        </div>

        <div className='space-y-1 text-sm text-primary-grey-300'>
          <p>• No account required</p>
          <p>• Rooms expire after 24 hours</p>
          <p>• Real-time collaboration</p>
        </div>
      </div>

      {showJoinModal && (
        <JoinRoomModal onClose={() => setShowJoinModal(false)} />
      )}
    </div>
  );
}

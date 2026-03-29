"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { generateRoomCode } from "@/lib/room-utils";
import { Button } from "@/components/ui/button";
import JoinRoomModal from "@/components/JoinRoomModal";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleCreateRoom = async () => {
    setLoading(true);

    try {
      // Use the protected API endpoint for room creation
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to create room. Please try again.");
        setLoading(false);
        return;
      }

      console.log("Created room code:", data.roomCode);

      // Navigate to the room - Liveblocks will create it automatically
      router.push(`/room/${data.roomCode}`);
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error(
        "Failed to create room. Please check your connection and try again."
      );
      setLoading(false);
    }
  };

  const handleJoinRoom = () => {
    setShowJoinModal(true);
  };

  return (
    <div className='flex h-screen items-center justify-center bg-gray-100 dark:bg-primary-grey-200'>
      <div className='space-y-8 p-8 text-center'>
        <div className='space-y-4'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>Welcome to NeoLive</h1>
          <p className='text-lg text-gray-500 dark:text-primary-grey-300'>
            Real-time collaborative design made simple. Create or join a room to
            get started.
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
            className='w-full max-w-sm rounded-lg border-2 border-gray-300 px-8 py-4 text-lg text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:border-primary-grey-300 dark:text-primary-grey-300 dark:hover:bg-primary-grey-300 dark:hover:text-primary-grey-200'
          >
            Join Existing Room
          </Button>
        </div>

        <div className='space-y-1 text-sm text-gray-500 dark:text-primary-grey-300'>
          <p>• No account required</p>
          <p>• Rooms auto-delete after 10 minutes when empty</p>
          <p>• Sustain rooms for 24 hours to preserve content</p>
          <p>• Real-time collaboration across networks</p>
        </div>
      </div>

      {showJoinModal && (
        <JoinRoomModal onClose={() => setShowJoinModal(false)} />
      )}
    </div>
  );
}

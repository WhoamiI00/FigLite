"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JoinRoomModalProps {
  onClose: () => void;
}

export default function JoinRoomModal({ onClose }: JoinRoomModalProps) {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return;

    setLoading(true);
    const code = roomCode.trim().toUpperCase();

    try {
      // Validate room code using the protected API
      const response = await fetch(`/api/rooms/${code}`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to validate room. Please try again.");
        setLoading(false);
        return;
      }

      // Room is valid, navigate to it
      router.push(`/room/${code}`);
    } catch (error) {
      console.error("Failed to validate room:", error);
      toast.error(
        "Failed to validate room. Please check your connection and try again."
      );
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJoinRoom();
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='mx-4 w-full max-w-md rounded-lg border border-primary-grey-100 bg-primary-black p-6'>
        <div className='space-y-4'>
          <div>
            <h2 className='mb-2 text-xl font-bold text-white'>Join Room</h2>
            <p className='text-sm text-primary-grey-300'>
              Enter the 6-character room code to join an existing room.
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='roomCode' className='text-white'>
              Room Code
            </Label>
            <Input
              id='roomCode'
              type='text'
              placeholder='ABC123'
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              maxLength={6}
              className='border-primary-grey-100 bg-primary-grey-100 font-mono tracking-wider text-white placeholder:text-primary-grey-300'
              autoFocus
            />
          </div>

          <div className='flex space-x-3'>
            <Button
              onClick={handleJoinRoom}
              disabled={!roomCode.trim() || loading}
              className='flex-1 bg-primary-green text-primary-black hover:bg-green-600'
            >
              {loading ? "Joining..." : "Join Room"}
            </Button>
            <Button
              onClick={onClose}
              variant='outline'
              className='border-primary-grey-100 px-6 text-primary-grey-300 hover:bg-primary-grey-100'
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

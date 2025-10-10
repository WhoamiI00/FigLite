"use client";

import { useState } from "react";
import { Copy, Share2, QrCode, X } from "lucide-react";
import { createShareableUrl } from "@/lib/room-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShareRoomModalProps {
  roomCode: string;
  onClose: () => void;
}

export default function ShareRoomModal({
  roomCode,
  onClose,
}: ShareRoomModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = createShareableUrl(roomCode);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='mx-4 w-full max-w-md rounded-lg border border-primary-grey-100 bg-primary-black p-6'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Share2 size={20} className='text-primary-green' />
              <h2 className='text-xl font-bold text-white'>Share Room</h2>
            </div>
            <Button
              onClick={onClose}
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0 text-primary-grey-300 hover:bg-primary-grey-100'
            >
              <X size={16} />
            </Button>
          </div>

          {/* Room Code */}
          <div className='space-y-2'>
            <Label className='text-white'>Room Code</Label>
            <div className='flex space-x-2'>
              <Input
                value={roomCode}
                readOnly
                className='border-primary-grey-100 bg-primary-grey-100 text-center font-mono text-lg tracking-wider text-white'
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleCopyCode}
                    variant='outline'
                    size='sm'
                    className='border-primary-grey-100 px-3 text-primary-grey-300 hover:bg-primary-grey-100'
                  >
                    <Copy size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {copied ? "Copied!" : "Copy room code"}
                </TooltipContent>
              </Tooltip>
            </div>
            <p className='text-xs text-primary-grey-300'>
              Share this 6-character code with others to invite them.
            </p>
          </div>

          {/* Share URL */}
          <div className='space-y-2'>
            <Label className='text-white'>Share Link</Label>
            <div className='flex space-x-2'>
              <Input
                value={shareUrl}
                readOnly
                className='border-primary-grey-100 bg-primary-grey-100 text-sm text-white'
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleCopyUrl}
                    variant='outline'
                    size='sm'
                    className='border-primary-grey-100 px-3 text-primary-grey-300 hover:bg-primary-grey-100'
                  >
                    <Copy size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {copied ? "Copied!" : "Copy share link"}
                </TooltipContent>
              </Tooltip>
            </div>
            <p className='text-xs text-primary-grey-300'>
              Anyone with this link can join the room directly.
            </p>
          </div>

          {/* Actions */}
          <div className='flex space-x-3 pt-2'>
            <Button
              onClick={handleCopyUrl}
              className='flex-1 bg-primary-green text-primary-black hover:bg-green-600'
            >
              <Share2 size={16} className='mr-2' />
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

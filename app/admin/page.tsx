"use client";

import { useState, useEffect } from "react";
import { RoomStorageManager } from "@/lib/room-storage";
import { RoomKeepaliveService } from "@/lib/room-keepalive";
import { RoomCleanupService } from "@/lib/room-cleanup";
import { Room } from "@/types/room";
import { formatRoomExpiry } from "@/lib/room-utils";

export default function AdminPanel() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    sustainedRooms: 0,
    expiredRooms: 0,
    activeKeepalives: 0,
  });

  const refreshData = () => {
    const activeRooms = RoomStorageManager.getActiveRooms();
    setRooms(activeRooms);

    const sustainedRooms = activeRooms.filter((room) => room.isSustained);
    const now = new Date();
    const expiredRooms = activeRooms.filter((room) => {
      if (room.isSustained && room.sustainedUntil) {
        return now > room.sustainedUntil;
      }
      return now > room.expiresAt;
    });

    setStats({
      totalRooms: activeRooms.length,
      sustainedRooms: sustainedRooms.length,
      expiredRooms: expiredRooms.length,
      activeKeepalives: RoomKeepaliveService.getActiveKeepalives().length,
    });
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleCleanupRoom = (roomCode: string) => {
    if (confirm(`Are you sure you want to delete room ${roomCode}?`)) {
      RoomStorageManager.deleteRoom(roomCode);
      const roomId = `figlite-${roomCode.toLowerCase()}`;
      RoomKeepaliveService.stopKeepalive(roomId);
      refreshData();
    }
  };

  const handleRunCleanup = () => {
    RoomCleanupService.runCleanup();
    refreshData();
  };

  return (
    <div className='min-h-screen bg-primary-grey-200 p-8'>
      <div className='mx-auto max-w-6xl'>
        <h1 className='mb-8 text-3xl font-bold text-white'>
          Figlite Room Admin
        </h1>

        {/* Stats Cards */}
        <div className='mb-8 grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='rounded-lg border border-primary-grey-100 bg-primary-black p-4'>
            <div className='text-2xl font-bold text-primary-green'>
              {stats.totalRooms}
            </div>
            <div className='text-sm text-primary-grey-300'>Total Rooms</div>
          </div>
          <div className='rounded-lg border border-primary-grey-100 bg-primary-black p-4'>
            <div className='text-2xl font-bold text-primary-green'>
              {stats.sustainedRooms}
            </div>
            <div className='text-sm text-primary-grey-300'>Sustained Rooms</div>
          </div>
          <div className='rounded-lg border border-primary-grey-100 bg-primary-black p-4'>
            <div className='text-2xl font-bold text-yellow-500'>
              {stats.expiredRooms}
            </div>
            <div className='text-sm text-primary-grey-300'>Expired Rooms</div>
          </div>
          <div className='rounded-lg border border-primary-grey-100 bg-primary-black p-4'>
            <div className='text-2xl font-bold text-blue-500'>
              {stats.activeKeepalives}
            </div>
            <div className='text-sm text-primary-grey-300'>
              Active Keepalives
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className='mb-6 flex gap-4'>
          <button
            onClick={refreshData}
            className='rounded-lg bg-primary-green px-4 py-2 text-primary-black transition-colors hover:bg-green-600'
          >
            Refresh Data
          </button>
          <button
            onClick={handleRunCleanup}
            className='rounded-lg bg-yellow-500 px-4 py-2 text-primary-black transition-colors hover:bg-yellow-600'
          >
            Run Cleanup
          </button>
        </div>

        {/* Rooms Table */}
        <div className='overflow-hidden rounded-lg border border-primary-grey-100 bg-primary-black'>
          <div className='border-b border-primary-grey-100 px-6 py-4'>
            <h2 className='text-xl font-bold text-white'>Active Rooms</h2>
          </div>

          {rooms.length === 0 ? (
            <div className='px-6 py-8 text-center text-primary-grey-300'>
              No active rooms found
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-primary-grey-100'>
                    <th className='px-6 py-3 text-left text-primary-grey-300'>
                      Room Code
                    </th>
                    <th className='px-6 py-3 text-left text-primary-grey-300'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-primary-grey-300'>
                      Participants
                    </th>
                    <th className='px-6 py-3 text-left text-primary-grey-300'>
                      Created
                    </th>
                    <th className='px-6 py-3 text-left text-primary-grey-300'>
                      Expiry
                    </th>
                    <th className='px-6 py-3 text-left text-primary-grey-300'>
                      Last Activity
                    </th>
                    <th className='px-6 py-3 text-left text-primary-grey-300'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr
                      key={room.code}
                      className='border-b border-primary-grey-100 hover:bg-primary-grey-100/10'
                    >
                      <td className='px-6 py-4 font-mono text-white'>
                        {room.code}
                      </td>
                      <td className='px-6 py-4'>
                        {room.isSustained ? (
                          <span className='rounded bg-primary-green px-2 py-1 text-xs text-primary-black'>
                            Sustained
                          </span>
                        ) : (
                          <span className='rounded bg-primary-grey-100 px-2 py-1 text-xs text-white'>
                            Normal
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 text-white'>
                        {room.participantCount}
                      </td>
                      <td className='px-6 py-4 text-sm text-primary-grey-300'>
                        {room.createdAt.toLocaleString()}
                      </td>
                      <td className='px-6 py-4 text-sm text-primary-grey-300'>
                        {formatRoomExpiry(room)}
                      </td>
                      <td className='px-6 py-4 text-sm text-primary-grey-300'>
                        {room.lastActivity.toLocaleString()}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex gap-2'>
                          <button
                            onClick={() =>
                              window.open(`/room/${room.code}`, "_blank")
                            }
                            className='rounded bg-blue-500 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-600'
                          >
                            Open
                          </button>
                          <button
                            onClick={() => handleCleanupRoom(room.code)}
                            className='rounded bg-red-500 px-3 py-1 text-xs text-white transition-colors hover:bg-red-600'
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className='mt-8 rounded-lg border border-primary-grey-100 bg-primary-black p-6'>
          <h3 className='mb-4 text-lg font-bold text-white'>
            How Sustain Works
          </h3>
          <div className='space-y-2 text-sm text-primary-grey-300'>
            <p>
              • <strong>Normal Rooms:</strong> Expire after 24 hours or 2 hours
              of inactivity
            </p>
            <p>
              • <strong>Sustained Rooms:</strong> Stay alive for 24 hours
              regardless of activity
            </p>
            <p>
              • <strong>Keepalive Service:</strong> Maintains phantom
              connections to preserve canvas data
            </p>
            <p>
              • <strong>Canvas Data:</strong> Preserved in Liveblocks even when
              no users are present
            </p>
            <p>
              • <strong>Room Sharing:</strong> Anyone with the room code can
              join and collaborate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

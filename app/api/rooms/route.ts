import { NextResponse } from "next/server";
import { generateRoomCode } from "@/lib/room-utils";

export const runtime = "edge";

export async function POST() {
  try {
    const roomCode = generateRoomCode();

    return NextResponse.json({
      success: true,
      roomCode,
      message: "Room created successfully",
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to create room. Please try again later.",
      },
      { status: 500 }
    );
  }
}

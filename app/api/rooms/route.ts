import arcjet, { detectBot, fixedWindow, shield } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";
import { generateRoomCode } from "@/lib/room-utils";

export const runtime = "edge";

// Strict Arcjet configuration for room creation
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    // Shield protection
    shield({ mode: "LIVE" }),
    // No bots allowed for room creation
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
    // Very strict rate limiting - only 3 room creations per minute
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 3,
    }),
  ],
});

export async function POST(request: NextRequest) {
  // Apply Arcjet protection
  const decision = await aj.protect(request);

  console.log("Room creation attempt:", {
    id: decision.id,
    conclusion: decision.conclusion,
    reason: decision.reason,
    ip: decision.ip,
  });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message:
            "You can only create 3 rooms per minute. Please wait before creating another room.",
          retryAfter: decision.reason.resetTime,
        },
        { status: 429 }
      );
    } else if (decision.reason.isBot()) {
      return NextResponse.json(
        {
          error: "Bot detected",
          message: "Automated room creation is not allowed.",
        },
        { status: 403 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Access denied",
          message: "Room creation request blocked for security reasons.",
        },
        { status: 403 }
      );
    }
  }

  try {
    // Generate a new room code
    const roomCode = generateRoomCode();

    // Log successful room creation for monitoring
    console.log("Room created successfully:", {
      roomCode,
      ip: decision.ip,
      timestamp: new Date().toISOString(),
    });

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

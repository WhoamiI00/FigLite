import arcjet, { detectBot, fixedWindow, shield } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Moderate Arcjet configuration for room validation
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    // Shield protection
    shield({ mode: "LIVE" }),
    // Allow some verified bots but block suspicious ones
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    // Moderate rate limiting - 20 room checks per minute
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 20,
    }),
  ],
});

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  // Apply Arcjet protection
  const decision = await aj.protect(request);

  console.log("Room validation attempt:", {
    id: decision.id,
    conclusion: decision.conclusion,
    reason: decision.reason,
    ip: decision.ip,
    roomCode: params.code,
  });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many room validation requests. Please slow down.",
          retryAfter: decision.reason.resetTime,
        },
        { status: 429 }
      );
    } else if (decision.reason.isBot()) {
      return NextResponse.json(
        {
          error: "Bot detected",
          message: "Automated room access is not allowed.",
        },
        { status: 403 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Access denied",
          message: "Room access request blocked for security reasons.",
        },
        { status: 403 }
      );
    }
  }

  try {
    const { code } = params;

    // Basic validation of room code format
    if (!code || code.length !== 6 || !/^[A-Z0-9]+$/.test(code)) {
      return NextResponse.json(
        {
          error: "Invalid room code",
          message:
            "Room code must be 6 characters long and contain only letters and numbers.",
        },
        { status: 400 }
      );
    }

    // In a real implementation, you'd check if the room exists in your database
    // For now, we'll assume all properly formatted codes are valid
    // You can integrate with your room storage system here

    console.log("Room validation successful:", {
      roomCode: code,
      ip: decision.ip,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      roomCode: code,
      exists: true, // You'd check actual room existence here
      message: "Room is valid and accessible",
    });
  } catch (error) {
    console.error("Error validating room:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to validate room. Please try again later.",
      },
      { status: 500 }
    );
  }
}

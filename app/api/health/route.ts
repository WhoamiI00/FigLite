import arcjet, { detectBot, fixedWindow, shield } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Light Arcjet configuration for health checks
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    // Basic shield protection
    shield({ mode: "LIVE" }),
    // Allow monitoring bots
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:MONITOR", "CATEGORY:SEARCH_ENGINE"],
    }),
    // Higher rate limit for health checks
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 100, // 100 health checks per minute
    }),
  ],
});

export async function GET(request: NextRequest) {
  // Apply Arcjet protection
  const decision = await aj.protect(request);

  if (decision.isDenied()) {
    console.log("Health check blocked:", {
      id: decision.id,
      reason: decision.reason,
      ip: decision.ip,
    });

    return NextResponse.json(
      {
        status: "blocked",
        reason: decision.reason.toString(),
      },
      { status: 403 }
    );
  }

  // Return health status
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    arcjet: {
      enabled: true,
      decision: {
        id: decision.id,
        conclusion: decision.conclusion,
      },
    },
    app: {
      name: "NeoLive",
      version: "1.0.0",
    },
  });
}

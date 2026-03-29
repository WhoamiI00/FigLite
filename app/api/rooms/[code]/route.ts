import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

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

    return NextResponse.json({
      success: true,
      roomCode: code,
      exists: true,
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

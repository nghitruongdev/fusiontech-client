import { NextRequest, NextResponse } from "next/server";

const basePath = "/api/auth/";

export async function GET(req: NextRequest) {
    console.log("req", req);
    const pathname = req.nextUrl.pathname.replace(basePath, "");
    throw new Error("Not enough time to implement this");
    return NextResponse.error().json();
    switch (pathname) {
        case "session":
            return NextResponse.json({ isAuthenticated: true });
    }
}

import { NextRequest, NextResponse } from "next/server";

const basePath = "/api/auth/";

export async function GET(req: NextRequest) {
    console.log("req", req);
    const pathname = req.nextUrl.pathname.replace(basePath, "");
    switch (pathname) {
        case "session":
            return NextResponse.json({ isAuthenticated: true });
    }
}

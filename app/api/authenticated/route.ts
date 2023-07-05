import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, resp: NextResponse) {
    console.log("req", req);
    // cookies().set("authenticated", {});
    return NextResponse.json(undefined);
}

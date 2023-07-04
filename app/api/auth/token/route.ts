import { auth } from "firebase-admin";
import { getApp } from "firebase-admin/app";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    // const {
    //     nextUrl: {  },
    // } = req;
    console.log("req", req);
    const token = await auth(getApp("ADMIN")).createCustomToken(
        "pnDV2lWbRSX82R1FefSUIslfEef1",
    );

    return NextResponse.json(token);
}

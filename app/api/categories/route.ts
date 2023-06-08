import { Category } from "@/interfaces";
import { NextRequest, NextResponse } from "next/server";

const categories: Category[] = [
    {
        name: "Category 1",
    },
];
export async function GET(req: NextRequest) {
    return NextResponse.json(categories);
}

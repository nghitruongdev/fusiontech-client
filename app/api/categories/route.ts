import { Category } from "@/interfaces";
import { NextRequest, NextResponse } from "next/server";

const categories: Category[] = [
    "Laptop",
    "Điện thoại",
    "Tablet",
    "Phụ kiện công nghệ",
    "Âm thanh",
].map((item, idx) => ({
    id: idx + 1 + "",
    name: item,
}));
export async function GET(req: NextRequest) {
    return NextResponse.json(categories);
}

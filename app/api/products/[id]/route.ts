import { NextRequest, NextResponse } from "next/server";
import { products } from "../route";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const product = products._embedded.products.find(
        (item) => item.id === +params.id,
    );
    return NextResponse.json(product);
}

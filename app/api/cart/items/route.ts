import { ICartItem } from "@/interfaces";
import { NextRequest, NextResponse } from "next/server";

const cartItems: ICartItem[] = Array.from({
    length: Math.ceil(Math.random() * 5),
}).map(() => {
    return {
        variantId: Math.ceil(Math.random() * 10),
        price: +(Math.random() * 1000000).toFixed(2),
        quantity: Math.ceil(Math.random() * 3),
    };
});
export async function GET(req: NextRequest) {
    return NextResponse.json(cartItems);
}

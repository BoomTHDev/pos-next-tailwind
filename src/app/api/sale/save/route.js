import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { totalPrice, quantity, productId, userId } = await request.json();
        
        if (!totalPrice || !quantity || !productId || !userId) {
            throw new Error("Missing required fields");
        }

        await prisma.productDetail.create({
            data: {
                price: totalPrice,
                qty: quantity,
                productId: productId,
                UserId: userId,
            }
        });
        return NextResponse.json({ message: 'success' });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

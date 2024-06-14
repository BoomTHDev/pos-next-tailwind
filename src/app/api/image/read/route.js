import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const bannerImage = await prisma.imageBanner.findFirst({
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!bannerImage) {
            return NextResponse.json({ results: [] });
        }

        return NextResponse.json({ results: [{ id: bannerImage.id, image: bannerImage.imageUrl }] });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

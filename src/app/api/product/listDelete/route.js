import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const results = await prisma.product.findMany({
            orderBy: {
                id: 'desc'
            },
            where: {
                status: "delete"
            }
        })
        return NextResponse.json({ results: results })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
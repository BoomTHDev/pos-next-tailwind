import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
    try {
        const newProduct = await request.json()
        await prisma.product.create({
            data: newProduct
        })
        return NextResponse.json({ message: 'success' })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
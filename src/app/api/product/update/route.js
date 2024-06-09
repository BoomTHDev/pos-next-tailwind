import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(request) {
    try {
        const { id, ...data } = await request.json()
        const oldData = await prisma.product.findFirst({
            where: {
                id: parseInt(id)
            }
        })

        if (!oldData) {
            return NextResponse.json({ error: "Product no found"}, { status: 404 })
        }

        await prisma.product.update({
            data: data,
            where: {
                id: parseInt(id)
            }
        })
        return NextResponse.json({ message: 'success' })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
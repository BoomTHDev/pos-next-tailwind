import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, {params}) {

    const { id } = params

    try {
        const res = await prisma.product.findFirst({
            where: {
                id: parseInt(id),
                status: "use"
            }
        })
        return NextResponse.json({ result: res })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
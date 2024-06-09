import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(request) {
   try {
    const { name, email, password } = await request.json()
    const hashedPassword = bcrypt.hashSync(password, 10)
    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })
    return NextResponse.json({ message: 'success' })
   } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
   }
}
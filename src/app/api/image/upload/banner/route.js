import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import cloudinary from '@/app/components/cloudinary';

const prisma = new PrismaClient();

export async function POST(request) {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validMimeTypes.includes(file.type)) {
        return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    try {
        // อัพโหลดไฟล์ไปที่ Cloudinary
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    upload_preset: 'next-cloud',
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(fileBuffer);
        });

        // เก็บ URL ของรูปภาพในฐานข้อมูล
        const newBannerImage = await prisma.imageBanner.create({
            data: {
                imageUrl: uploadResponse.secure_url,
                createdAt: new Date(),
                updateAT: new Date()
            },
        });

        // ตรวจสอบค่า newBannerImage
        console.log('newBannerImage:', newBannerImage);

        return NextResponse.json({ newName: uploadResponse.secure_url }, { status: 200 });
    } catch (err) {
        console.error('Error uploading image:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

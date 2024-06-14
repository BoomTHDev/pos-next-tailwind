import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import cloudinary from '@/app/components/cloudinary';

const prisma = new PrismaClient();

export async function POST(request) {
  const data = await request.formData();
  const file = data.get('file');
  const productId = data.get('productId');

  try {
    const uploadResponse = await cloudinary.uploader.upload(file.path, {
      upload_preset: 'next-cloud',
    });

    const image = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: {
        image: uploadResponse.secure_url,
      },
    });

    return NextResponse.json({ url: image.image });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

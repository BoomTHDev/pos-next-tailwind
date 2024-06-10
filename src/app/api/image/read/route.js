import { NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';

export async function GET(request) {
    try {
        const directoryPath = path.join(process.cwd(), "public/uploads");
        const files = await fs.readdir(directoryPath);
        const promoteFiles = files.filter(file => file.startsWith('Banner_'));
        const fileList = promoteFiles.map((file, index) => ({ id: index, filename: file }));
        return NextResponse.json({ results: fileList });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
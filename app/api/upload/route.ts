import { NextResponse } from 'next/server';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Save file and get URL
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(process.cwd(), 'public', 'uploads', fileName);
    await writeFile(filePath, buffer);
    const fileUrl = `/uploads/${fileName}`;

    // Process with OCR
    let text = '';
    if (file.type === 'application/pdf') {
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.0 });
      
      // Create a canvas element for PDF rendering
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');
      
      await page.render({ canvasContext: context, viewport }).promise;
      
      const worker = await createWorker();
      const { data: { text: ocrText } } = await worker.recognize(canvas);
      await worker.terminate();
      text = ocrText;
    } else {
      const worker = await createWorker();
      const { data: { text: ocrText } } = await worker.recognize(buffer);
      await worker.terminate();
      text = ocrText;
    }

    // Extract invoice amount
    const amountMatch = text.match(/\$?\d+,?\d*\.?\d*/);
    const invoiceAmount = amountMatch ? parseFloat(amountMatch[0].replace(/[$,]/g, '')) : null;

    // Save to database
    db.prepare(`
      INSERT INTO documents (id, fileName, fileType, fileSize, originalUrl, jsonOutput, invoiceAmount, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      randomUUID(),
      file.name,
      file.type,
      file.size,
      fileUrl,
      JSON.stringify({ text, invoiceAmount }),
      invoiceAmount,
      'completed'
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
}
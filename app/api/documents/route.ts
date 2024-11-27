import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const documents = db.prepare(`
      SELECT * FROM documents 
      ORDER BY processedAt DESC 
      LIMIT 10
    `).all();

    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
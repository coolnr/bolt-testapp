import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { startOfDay } from 'date-fns';

export async function GET() {
  try {
    const totalDocuments = db.prepare('SELECT COUNT(*) as count FROM documents').get().count;
    const processedToday = db.prepare(`
      SELECT COUNT(*) as count 
      FROM documents 
      WHERE date(processedAt) = date('now')
    `).get().count;
    const totalInvoiceAmount = db.prepare(`
      SELECT COALESCE(SUM(invoiceAmount), 0) as total 
      FROM documents
    `).get().total;

    return NextResponse.json({
      totalDocuments,
      processedToday,
      totalInvoiceAmount,
      avgProcessingTime: 2.5, // Placeholder - implement actual calculation if needed
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
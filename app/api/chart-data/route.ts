import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subDays, format } from 'date-fns';

export async function GET() {
  try {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const count = db.prepare(`
        SELECT COUNT(*) as count 
        FROM documents 
        WHERE date(processedAt) = date(?)
      `).get(date).count;

      return {
        date: format(subDays(new Date(), i), 'MMM d'),
        documents: count,
      };
    });

    return NextResponse.json(days.reverse());
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
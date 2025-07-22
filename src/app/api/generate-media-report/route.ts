import { NextRequest, NextResponse } from 'next/server';
import { generateMediaReport } from '../../../pipeline/generateMediaReport';

export async function POST(request: NextRequest) {
  try {
    const { client, query } = await request.json();
    if (!client || !query) {
      return NextResponse.json({ error: 'Missing client or query' }, { status: 400 });
    }
    const report = await generateMediaReport(client, query);
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 
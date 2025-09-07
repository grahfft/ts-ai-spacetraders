import { NextRequest, NextResponse } from 'next/server';
import { handleCreateAgent } from './handler';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await handleCreateAgent(body);
  return NextResponse.json(result.body as any, { status: result.status });
}

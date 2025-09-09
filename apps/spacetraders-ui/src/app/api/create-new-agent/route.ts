import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symbol, faction, email } = body ?? {};
    if (!symbol || !faction) {
      return NextResponse.json(
        { error: 'symbol and faction are required' },
        { status: 400 }
      );
    }
    const base = (process.env.NEXT_PUBLIC_SERVICE_URL || process.env.SERVICE_URL)?.replace(/\/$/, '');
    if (!base) {
      return NextResponse.json(
        { error: 'Service URL not configured. Set NEXT_PUBLIC_SERVICE_URL to your Nest API base (e.g., http://localhost:3001/api).' },
        { status: 500 }
      );
    }
    const res = await fetch(`${base}/agents/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, faction, email }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (error: any) {
    const message = error?.response?.data ?? {
      error: error?.message ?? 'Unknown error',
    };
    return NextResponse.json(message, { status: 500 });
  }
}

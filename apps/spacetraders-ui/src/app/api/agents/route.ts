import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const base = (process.env.NEXT_PUBLIC_SERVICE_URL || process.env.SERVICE_URL)?.replace(/\/$/, '');
    if (!base) {
      return NextResponse.json(
        { error: 'Service URL not configured. Set NEXT_PUBLIC_SERVICE_URL to your Nest API base (e.g., http://api:3000/api).' },
        { status: 500 }
      );
    }
    const res = await fetch(`${base}/agents`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (error: any) {
    const message = { error: error?.message ?? 'Unknown error' };
    return NextResponse.json(message, { status: 500 });
  }
}



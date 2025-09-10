import { NextResponse } from 'next/server';

function resolveBase(): string | null {
  const raw = (process.env.NEXT_PUBLIC_SERVICE_URL || process.env.SERVICE_URL) ?? '';
  if (!raw) return null;
  let base = raw.replace(/\/$/, '');
  if (!/\/api(\/|$)/.test(base)) base = `${base}/api`;
  return base;
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const base = resolveBase();
    if (!base) return NextResponse.json({ error: 'Service URL not configured' }, { status: 500 });
    const { id } = await ctx.params;
    const res = await fetch(`${base}/agents/${id}`, { cache: 'no-store' });
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}



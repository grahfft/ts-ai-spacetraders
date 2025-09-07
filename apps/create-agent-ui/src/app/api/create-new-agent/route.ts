import { NextRequest, NextResponse } from 'next/server';
import { registerAgentServer } from 'services';

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
    const data = await registerAgentServer({ symbol, faction, email });
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    const message = error?.response?.data ?? {
      error: error?.message ?? 'Unknown error',
    };
    return NextResponse.json(message, { status: 500 });
  }
}

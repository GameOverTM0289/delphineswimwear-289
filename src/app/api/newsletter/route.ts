import { NextResponse } from 'next/server';
import { dbReady } from '@/lib/prisma';
import { subscribeNewsletter } from '@/lib/db/messages';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!dbReady()) {
    return NextResponse.json({ error: 'DATABASE_NOT_CONFIGURED' }, { status: 503 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = String(body.email ?? '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    await subscribeNewsletter(email);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.message === 'DATABASE_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'DATABASE_NOT_CONFIGURED' }, { status: 503 });
    }
    console.error('[newsletter POST]', err);
    return NextResponse.json({ error: 'Could not subscribe' }, { status: 500 });
  }
}

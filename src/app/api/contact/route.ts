import { NextResponse } from 'next/server';
import { dbReady } from '@/lib/prisma';
import { recordContactMessage } from '@/lib/db/messages';

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

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const subject = body.subject ? String(body.subject).trim() : undefined;
  const message = String(body.message ?? '').trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: 'Message too long' }, { status: 400 });
  }

  try {
    await recordContactMessage({ name, email, subject, message });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.message === 'DATABASE_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'DATABASE_NOT_CONFIGURED' }, { status: 503 });
    }
    console.error('[contact POST]', err);
    return NextResponse.json({ error: 'Could not send message' }, { status: 500 });
  }
}

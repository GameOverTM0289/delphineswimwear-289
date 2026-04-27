import { NextResponse } from 'next/server';
import { prisma, dbReady } from '@/lib/prisma';
import { verifyPokWebhook } from '@/lib/payment';

export const runtime = 'nodejs';

/**
 * POK payment webhook stub.
 *
 * When POK shares their webhook signing scheme, replace verifyPokWebhook
 * in lib/payment.ts with a real signature check. The handler below already
 * routes verified payloads to the order it references.
 */
export async function POST(req: Request) {
  if (!dbReady() || !prisma) {
    return NextResponse.json({ error: 'DATABASE_NOT_CONFIGURED' }, { status: 503 });
  }

  const raw = await req.text();
  const signature = req.headers.get('x-pok-signature');

  if (!verifyPokWebhook(raw, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Expected (placeholder) payload shape:
  //   { event: 'payment.succeeded' | 'payment.failed', orderNumber: 'DEL-2026-XXXX', reference: '...' }
  const orderNumber = payload?.orderNumber;
  const event = payload?.event;
  const reference = payload?.reference ?? null;

  if (!orderNumber || !event) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({ where: { orderNumber } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    let paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' = order.paymentStatus;
    let status = order.status;
    if (event === 'payment.succeeded') {
      paymentStatus = 'paid';
      if (status === 'pending') status = 'processing';
    } else if (event === 'payment.failed') {
      paymentStatus = 'failed';
    } else if (event === 'payment.refunded') {
      paymentStatus = 'refunded';
    }

    await prisma.order.update({
      where: { orderNumber },
      data: { paymentStatus, status, paymentRef: reference ?? order.paymentRef },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[payment webhook]', err);
    return NextResponse.json({ error: 'Could not process webhook' }, { status: 500 });
  }
}

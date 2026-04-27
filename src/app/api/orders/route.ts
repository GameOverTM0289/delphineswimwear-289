import { NextResponse } from 'next/server';
import { dbReady } from '@/lib/prisma';
import { createOrder } from '@/lib/db/orders';
import { createPaymentSession } from '@/lib/payment';
import type { CartLine, ShippingAddress } from '@/lib/types';

export const runtime = 'nodejs';

interface OrderRequestBody {
  items: CartLine[];
  shipping: ShippingAddress;
  shippingCents?: number;
}

export async function POST(req: Request) {
  if (!dbReady()) {
    return NextResponse.json(
      { error: 'DATABASE_NOT_CONFIGURED' },
      { status: 503 },
    );
  }

  let body: OrderRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // ── basic validation ─────────────────────────────────────────
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }
  if (!body.shipping?.email || !body.shipping?.firstName || !body.shipping?.address1) {
    return NextResponse.json({ error: 'Missing shipping details' }, { status: 400 });
  }

  // sanitize items defensively
  const items: CartLine[] = body.items.map((it) => ({
    productId: String(it.productId),
    slug: String(it.slug),
    name: String(it.name),
    image: String(it.image),
    size: String(it.size),
    color: String(it.color),
    price: Number(it.price),
    quantity: Math.max(1, Math.min(99, Number(it.quantity) || 1)),
  }));

  try {
    const order = await createOrder({
      items,
      shipping: body.shipping,
      shippingCents: body.shippingCents ?? 0,
    });

    // create payment session (stub for now)
    const session = await createPaymentSession({
      orderNumber: order.orderNumber,
      amountCents: order.totalCents,
      currency: order.currency,
      customerEmail: order.email,
      customerName: order.customerName,
    });

    return NextResponse.json({
      orderNumber: order.orderNumber,
      redirectUrl: session.redirectUrl,
      paymentLive: session.live,
    });
  } catch (err: any) {
    console.error('[orders POST]', err);
    if (err?.message === 'DATABASE_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'DATABASE_NOT_CONFIGURED' }, { status: 503 });
    }
    return NextResponse.json(
      { error: 'Could not create order' },
      { status: 500 },
    );
  }
}

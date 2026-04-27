import { NextResponse } from 'next/server';
import { getOrderByNumber, updateOrderStatus } from '@/lib/db/orders';
import { getAdminEmail } from '@/lib/auth';

export const runtime = 'nodejs';

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
  const order = await getOrderByNumber(params.id);
  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: Params) {
  const admin = getAdminEmail();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const patch: any = {};
  if (body.status && allowedStatuses.includes(body.status)) {
    patch.status = body.status;
  }
  if (typeof body.trackingNumber === 'string') patch.trackingNumber = body.trackingNumber;
  if (typeof body.notes === 'string') patch.notes = body.notes;

  try {
    const order = await updateOrderStatus(params.id, patch);
    return NextResponse.json(order);
  } catch (err: any) {
    if (err?.message === 'DATABASE_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'DATABASE_NOT_CONFIGURED' }, { status: 503 });
    }
    console.error('[orders PATCH]', err);
    return NextResponse.json({ error: 'Could not update order' }, { status: 500 });
  }
}

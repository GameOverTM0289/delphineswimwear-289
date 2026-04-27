import { prisma, dbReady } from '@/lib/prisma';
import type {
  CartLine,
  ShippingAddress,
  OrderStatus,
  PaymentStatus,
} from '@/lib/types';

const ORDER_PREFIX = 'DEL';

// Friendly shapes mirroring the Prisma schema. Used by pages and API
// routes so they can render orders without depending on Prisma's
// generated types being present at typecheck time.
export interface OrderItemRow {
  id: string;
  orderId: string;
  productId: string | null;
  productSlug: string;
  productName: string;
  size: string;
  color: string;
  priceCents: number;
  quantity: number;
  image: string;
}

export interface OrderRow {
  id: string;
  orderNumber: string;
  email: string;
  customerName: string;
  phone: string | null;
  address1: string;
  address2: string | null;
  city: string;
  postalCode: string;
  country: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentRef: string | null;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemRow[];
}

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  // Random 4-digit suffix is fine for v1; later swap for a sequence.
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${ORDER_PREFIX}-${year}-${suffix}`;
}

export interface CreateOrderInput {
  items: CartLine[];
  shipping: ShippingAddress;
  shippingCents: number;
  taxCents?: number;
}

export async function createOrder(input: CreateOrderInput): Promise<OrderRow> {
  if (!dbReady() || !prisma) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  const subtotalCents = input.items.reduce(
    (acc, it) => acc + Math.round(it.price * 100) * it.quantity,
    0,
  );
  const totalCents = subtotalCents + input.shippingCents + (input.taxCents ?? 0);

  const orderNumber = await generateOrderNumber();

  const result = await prisma.order.create({
    data: {
      orderNumber,
      email: input.shipping.email,
      customerName: `${input.shipping.firstName} ${input.shipping.lastName}`.trim(),
      phone: input.shipping.phone,
      address1: input.shipping.address1,
      address2: input.shipping.address2 || null,
      city: input.shipping.city,
      postalCode: input.shipping.postalCode,
      country: input.shipping.country,
      subtotalCents,
      shippingCents: input.shippingCents,
      taxCents: input.taxCents ?? 0,
      totalCents,
      currency: 'EUR',
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'pok',
      items: {
        create: input.items.map((it) => ({
          productId: it.productId.startsWith('static-') ? null : it.productId,
          productSlug: it.slug,
          productName: it.name,
          size: it.size,
          color: it.color,
          priceCents: Math.round(it.price * 100),
          quantity: it.quantity,
          image: it.image,
        })),
      },
    },
    include: { items: true },
  });
  return result as unknown as OrderRow;
}

export async function getOrderByNumber(
  orderNumber: string,
): Promise<OrderRow | null> {
  if (!dbReady() || !prisma) return null;
  const result = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  return result as unknown as OrderRow | null;
}

export async function listOrders(limit = 100): Promise<OrderRow[]> {
  if (!dbReady() || !prisma) return [];
  const result = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { items: true },
  });
  return result as unknown as OrderRow[];
}

export async function updateOrderStatus(
  orderNumber: string,
  patch: Partial<{
    status: OrderStatus;
    trackingNumber: string;
    notes: string;
  }>,
): Promise<OrderRow> {
  if (!dbReady() || !prisma) throw new Error('DATABASE_NOT_CONFIGURED');
  const result = await prisma.order.update({
    where: { orderNumber },
    data: patch,
  });
  return result as unknown as OrderRow;
}

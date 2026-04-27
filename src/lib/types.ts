// Public-facing types. Mirrors Prisma models but uses friendly shapes
// (price as euros, not cents) so the UI doesn't sprinkle /100 everywhere.

export type Category = 'one-pieces' | 'bikinis';

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: Category;
  description: string;
  price: number;            // in EUR (decimal)
  priceCents: number;       // raw cents
  currency: string;
  badge: string | null;
  mainImage: string;
  altImage: string;
  swatchHex: string;
  sizes: string[];
  featured: boolean;
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;            // in EUR
  quantity: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderSummary {
  id: string;
  orderNumber: string;
  email: string;
  customerName: string;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  itemCount: number;
  createdAt: string;
}

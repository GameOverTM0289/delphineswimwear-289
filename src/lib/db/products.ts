import { prisma, dbReady } from '@/lib/prisma';
import { STATIC_PRODUCTS } from '@/lib/data/products';
import type { Product, Category } from '@/lib/types';

// Map a Prisma row to the public Product shape.
type AnyRow = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  description: string;
  priceCents: number;
  currency: string;
  badge: string | null;
  mainImage: string;
  altImage: string;
  swatchHex: string;
  sizes: string[];
  featured: boolean;
};

function fromRow(row: AnyRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle,
    category: row.category as Category,
    description: row.description,
    price: row.priceCents / 100,
    priceCents: row.priceCents,
    currency: row.currency,
    badge: row.badge,
    mainImage: row.mainImage,
    altImage: row.altImage,
    swatchHex: row.swatchHex,
    sizes: row.sizes,
    featured: row.featured,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  if (!dbReady() || !prisma) return STATIC_PRODUCTS;
  try {
    const rows = await prisma.product.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    });
    if (rows.length === 0) return STATIC_PRODUCTS; // db is empty → use fallback
    return rows.map(fromRow);
  } catch (err) {
    console.error('[products] DB read failed, using fallback:', err);
    return STATIC_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!dbReady() || !prisma) {
    return STATIC_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  try {
    const row = await prisma.product.findUnique({ where: { slug } });
    if (row) return fromRow(row);
  } catch (err) {
    console.error('[products] DB read failed, using fallback:', err);
  }
  return STATIC_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getProductsByCategory(category: Category): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.category === category);
}

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  const all = await getAllProducts();
  const featured = all.filter((p) => p.featured);
  return featured.slice(0, limit);
}

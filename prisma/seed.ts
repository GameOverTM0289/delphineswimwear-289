// Seeds the database with the 6 products from the design.
// Run with:  npm run db:seed
//
// The seed is idempotent — running it again is safe. It also removes
// any older products that no longer exist in this list (cleaning up
// stale rows from previous schema iterations).

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    slug: 'cherry-tomatoes',
    name: 'Cherry Tomatoes',
    subtitle: 'Bikini Set · Vermilion',
    category: 'bikinis',
    description:
      'A refined silhouette in soft-touch fabric — designed for ease of movement and a quiet, considered feel against the skin. Cut and finished with care in our Mediterranean atelier.',
    priceCents: 18500,
    badge: 'Best Seller',
    mainImage: '/assets/products/p1.jpg',
    altImage: '/assets/products/p4.jpg',
    swatchHex: '#C62828',
    featured: true,
    sortOrder: 1,
  },
  {
    slug: 'little-boy-laces',
    name: 'Little Boy Laces',
    subtitle: 'Two Piece · Periwinkle',
    category: 'bikinis',
    description:
      'A refined silhouette in soft-touch fabric — designed for ease of movement and a quiet, considered feel against the skin. Cut and finished with care in our Mediterranean atelier.',
    priceCents: 18500,
    badge: null,
    mainImage: '/assets/products/p2.jpg',
    altImage: '/assets/products/p5.jpg',
    swatchHex: '#8FA8D4',
    featured: true,
    sortOrder: 2,
  },
  {
    slug: 'sun-kissed-one-piece',
    name: 'Sun-Kissed One Piece',
    subtitle: 'One Piece · Citron',
    category: 'one-pieces',
    description:
      'A refined silhouette in soft-touch fabric — designed for ease of movement and a quiet, considered feel against the skin. Cut and finished with care in our Mediterranean atelier.',
    priceCents: 22000,
    badge: 'New',
    mainImage: '/assets/products/p3.jpg',
    altImage: '/assets/products/p6.jpg',
    swatchHex: '#E8C547',
    featured: true,
    sortOrder: 3,
  },
  {
    slug: 'vermilion-one-piece',
    name: 'Vermilion One Piece',
    subtitle: 'One Piece · Vermilion',
    category: 'one-pieces',
    description:
      'A refined silhouette in soft-touch fabric — designed for ease of movement and a quiet, considered feel against the skin. Cut and finished with care in our Mediterranean atelier.',
    priceCents: 22000,
    badge: 'Best Seller',
    mainImage: '/assets/products/p4.jpg',
    altImage: '/assets/products/p1.jpg',
    swatchHex: '#B53538',
    featured: false,
    sortOrder: 4,
  },
  {
    slug: 'periwinkle-bikini',
    name: 'Periwinkle Bikini',
    subtitle: 'Bikini Set · Periwinkle',
    category: 'bikinis',
    description:
      'A refined silhouette in soft-touch fabric — designed for ease of movement and a quiet, considered feel against the skin. Cut and finished with care in our Mediterranean atelier.',
    priceCents: 18500,
    badge: null,
    mainImage: '/assets/products/p5.jpg',
    altImage: '/assets/products/p2.jpg',
    swatchHex: '#8FA8D4',
    featured: false,
    sortOrder: 5,
  },
  {
    slug: 'citron-one-piece',
    name: 'Citron One Piece',
    subtitle: 'One Piece · Citron',
    category: 'one-pieces',
    description:
      'A refined silhouette in soft-touch fabric — designed for ease of movement and a quiet, considered feel against the skin. Cut and finished with care in our Mediterranean atelier.',
    priceCents: 22000,
    badge: 'New',
    mainImage: '/assets/products/p6.jpg',
    altImage: '/assets/products/p3.jpg',
    swatchHex: '#E8C547',
    featured: false,
    sortOrder: 6,
  },
];

async function main() {
  const validSlugs = products.map((p) => p.slug);

  // 1. Remove stale products from previous schema iterations.
  // Use deleteMany with NotIn so we only purge rows that no longer
  // belong, but keep order history intact (OrderItem.productId is
  // SetNull, so existing orders are unaffected).
  const stale = await prisma.product.findMany({
    where: { slug: { notIn: validSlugs } },
    select: { slug: true, name: true },
  });

  if (stale.length > 0) {
    console.log('🧹 Removing stale products:');
    stale.forEach((p) => console.log(`  − ${p.name} (${p.slug})`));
    await prisma.product.deleteMany({
      where: { slug: { notIn: validSlugs } },
    });
  }

  // 2. Upsert the canonical 6.
  console.log('🌱 Seeding products…');
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    console.log(`  ✓ ${p.name}`);
  }
  console.log(`✓ Seeded ${products.length} products. Database is in sync.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });

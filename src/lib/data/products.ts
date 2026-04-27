import { Product } from '@/lib/types';

// These six products mirror the design's intended catalog and the
// Prisma seed. The site reads from the DB when DATABASE_URL is set;
// otherwise it falls back to this list so the marketing pages render
// even before a database is provisioned.
//
// Image pairings:
// - Best sellers / featured: Cherry Tomatoes, Little Boy Laces, Sun-Kissed One Piece
// - Each product uses one of Product_1.jpg ... Product_6.jpg as main image,
//   plus an alt image for hover/gallery.

export const STATIC_PRODUCTS: Product[] = [
  {
    id: 'static-cherry-tomatoes',
    slug: 'cherry-tomatoes',
    name: 'Cherry Tomatoes',
    subtitle: 'Bikini Set · Vermilion',
    category: 'bikinis',
    description:
      'A refined silhouette in soft-touch fabric — designed for ease of movement and a quiet, considered feel against the skin. Cut and finished with care in our Mediterranean atelier.',
    price: 185,
    priceCents: 18500,
    currency: 'EUR',
    badge: 'Best Seller',
    mainImage: '/assets/products/p1.jpg',
    altImage: '/assets/products/p4.jpg',
    swatchHex: '#C62828',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: true,
  },
  {
    id: 'static-little-boy-laces',
    slug: 'little-boy-laces',
    name: 'Little Boy Laces',
    subtitle: 'Two Piece · Periwinkle',
    category: 'bikinis',
    description:
      'A refined silhouette in soft-touch fabric — designed for ease of movement and a quiet, considered feel against the skin. Cut and finished with care in our Mediterranean atelier.',
    price: 185,
    priceCents: 18500,
    currency: 'EUR',
    badge: null,
    mainImage: '/assets/products/p2.jpg',
    altImage: '/assets/products/p5.jpg',
    swatchHex: '#8FA8D4',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: true,
  },
  {
    id: 'static-sun-kissed-one-piece',
    slug: 'sun-kissed-one-piece',
    name: 'Sun-Kissed One Piece',
    subtitle: 'One Piece · Citron',
    category: 'one-pieces',
    description:
      'A refined silhouette in soft-touch fabric — designed for ease of movement and a quiet, considered feel against the skin. Cut and finished with care in our Mediterranean atelier.',
    price: 220,
    priceCents: 22000,
    currency: 'EUR',
    badge: 'New',
    mainImage: '/assets/products/p3.jpg',
    altImage: '/assets/products/p6.jpg',
    swatchHex: '#E8C547',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: true,
  },
  {
    id: 'static-vermilion-one-piece',
    slug: 'vermilion-one-piece',
    name: 'Vermilion One Piece',
    subtitle: 'One Piece · Vermilion',
    category: 'one-pieces',
    description:
      'A refined silhouette in soft-touch fabric — designed for ease of movement and a quiet, considered feel against the skin. Cut and finished with care in our Mediterranean atelier.',
    price: 220,
    priceCents: 22000,
    currency: 'EUR',
    badge: 'Best Seller',
    mainImage: '/assets/products/p4.jpg',
    altImage: '/assets/products/p1.jpg',
    swatchHex: '#B53538',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: false,
  },
  {
    id: 'static-periwinkle-bikini',
    slug: 'periwinkle-bikini',
    name: 'Periwinkle Bikini',
    subtitle: 'Bikini Set · Periwinkle',
    category: 'bikinis',
    description:
      'A refined silhouette in soft-touch fabric — designed for ease of movement and a quiet, considered feel against the skin. Cut and finished with care in our Mediterranean atelier.',
    price: 185,
    priceCents: 18500,
    currency: 'EUR',
    badge: null,
    mainImage: '/assets/products/p5.jpg',
    altImage: '/assets/products/p2.jpg',
    swatchHex: '#8FA8D4',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: false,
  },
  {
    id: 'static-citron-one-piece',
    slug: 'citron-one-piece',
    name: 'Citron One Piece',
    subtitle: 'One Piece · Citron',
    category: 'one-pieces',
    description:
      'A refined silhouette in soft-touch fabric — designed for ease of movement and a quiet, considered feel against the skin. Cut and finished with care in our Mediterranean atelier.',
    price: 220,
    priceCents: 22000,
    currency: 'EUR',
    badge: 'New',
    mainImage: '/assets/products/p6.jpg',
    altImage: '/assets/products/p3.jpg',
    swatchHex: '#E8C547',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: false,
  },
];

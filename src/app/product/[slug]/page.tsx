import { notFound } from 'next/navigation';
import Announcement from '@/components/layout/Announcement';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ProductPurchase from '@/components/product/ProductPurchase';
import ProductGallery from '@/components/product/ProductGallery';
import { getProductBySlug, getAllProducts } from '@/lib/db/products';
import { formatPrice } from '@/lib/utils';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const p = await getProductBySlug(params.slug);
  if (!p) return { title: 'Product not found' };
  return {
    title: p.name,
    description: p.description,
  };
}

export async function generateStaticParams() {
  try {
    const all = await getAllProducts();
    return all.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <>
      <Announcement />
      <Nav />
      <main>
        <section className="product-detail">
          <ProductGallery
            images={[product.mainImage, product.altImage]}
            alt={product.name}
          />
          <div className="pd-info">
            <span className="eyebrow">{product.subtitle}</span>
            <h1>{product.name}</h1>
            <div className="price">{formatPrice(product.price, product.currency)}</div>
            <p className="desc">{product.description}</p>

            <ProductPurchase product={product} />

            <div className="pd-feat">
              <div>
                <strong>Made in</strong>
                Mediterranean atelier — small-batch
              </div>
              <div>
                <strong>Fabric</strong>
                Premium recycled-blend, soft-touch
              </div>
              <div>
                <strong>Care</strong>
                Hand wash cold, lay flat to dry
              </div>
              <div>
                <strong>Shipping</strong>
                Complimentary worldwide
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}

'use client';

import { useState } from 'react';
import { useCart } from '@/lib/store/cart';
import type { Product } from '@/lib/types';

interface Props {
  product: Product;
}

export default function ProductPurchase({ product }: Props) {
  const [size, setSize] = useState<string>(product.sizes[1] ?? product.sizes[0] ?? 'M');
  const [color] = useState<string>(product.subtitle.split('·')[1]?.trim() ?? 'Default');
  const add = useCart((s) => s.add);
  const open = useCart((s) => s.open);

  const onAdd = () => {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.mainImage,
      size,
      color,
      price: product.price,
      quantity: 1,
    });
    open();
  };

  return (
    <>
      <div className="pd-row">
        <span className="lab">Color · {color}</span>
        <div className="swatches">
          <button
            className="sw on"
            style={{ background: product.swatchHex }}
            aria-label={color}
          />
        </div>
      </div>

      <div className="pd-row">
        <span className="lab">Size</span>
        <div className="sizes">
          {product.sizes.map((s) => (
            <button
              key={s}
              className={`sz ${size === s ? 'on' : ''}`}
              onClick={() => setSize(s)}
              type="button"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="pd-actions">
        <button className="btn btn-dark" onClick={onAdd} type="button">
          Add to Bag <span className="ar">→</span>
        </button>
      </div>
    </>
  );
}

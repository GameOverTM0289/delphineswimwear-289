'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Announcement from '@/components/layout/Announcement';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { useCart } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';

const SHIPPING_FEE = 0; // free worldwide for now

export default function CheckoutPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    country: 'France',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    useCart.persist.rehydrate();
    setHydrated(true);
  }, []);

  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const total = subtotal + SHIPPING_FEE;

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (items.length === 0) {
      setError('Your bag is empty.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shipping: form,
          shippingCents: SHIPPING_FEE * 100,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitting(false);
        if (data?.error === 'DATABASE_NOT_CONFIGURED') {
          setError(
            'Our checkout is being set up — orders aren\u2019t available quite yet. Please check back soon or contact us directly.',
          );
        } else {
          setError(data?.error || 'Could not place your order. Please try again.');
        }
        return;
      }
      clear();
      router.push(data.redirectUrl || `/order/${data.orderNumber}?pending=1`);
    } catch {
      setSubmitting(false);
      setError('Could not place your order. Please try again.');
    }
  };

  if (hydrated && items.length === 0) {
    return (
      <>
        <Announcement />
        <Nav />
        <main>
          <div className="order-page">
            <h1>
              Your bag is <em>empty</em>
            </h1>
            <p>You haven&rsquo;t added anything yet. Browse the collection to begin.</p>
            <Link href="/shop" className="btn btn-dark">
              Shop the Collection <span className="ar">→</span>
            </Link>
          </div>
        </main>
        <Footer />
        <CartDrawer />
      </>
    );
  }

  return (
    <>
      <Announcement />
      <Nav />
      <main>
        <div className="checkout-wrap">
          <form className="checkout-form" onSubmit={onSubmit}>
            <h2>
              <em>Checkout</em>
            </h2>

            <div className="row2">
              <div>
                <span className="lab">First Name</span>
                <input value={form.firstName} onChange={update('firstName')} required />
              </div>
              <div>
                <span className="lab">Last Name</span>
                <input value={form.lastName} onChange={update('lastName')} required />
              </div>
            </div>

            <div className="row2">
              <div>
                <span className="lab">Email</span>
                <input type="email" value={form.email} onChange={update('email')} required />
              </div>
              <div>
                <span className="lab">Phone</span>
                <input type="tel" value={form.phone} onChange={update('phone')} required />
              </div>
            </div>

            <div>
              <span className="lab">Address</span>
              <input value={form.address1} onChange={update('address1')} required />
            </div>

            <div>
              <span className="lab">Apartment, suite, etc. (optional)</span>
              <input value={form.address2} onChange={update('address2')} />
            </div>

            <div className="row2">
              <div>
                <span className="lab">City</span>
                <input value={form.city} onChange={update('city')} required />
              </div>
              <div>
                <span className="lab">Postal Code</span>
                <input value={form.postalCode} onChange={update('postalCode')} required />
              </div>
            </div>

            <div>
              <span className="lab">Country</span>
              <select value={form.country} onChange={update('country')}>
                <option>France</option>
                <option>Italy</option>
                <option>Spain</option>
                <option>Greece</option>
                <option>Albania</option>
                <option>Germany</option>
                <option>United Kingdom</option>
                <option>United States</option>
                <option>Other</option>
              </select>
            </div>

            <button type="submit" className="btn btn-dark" disabled={submitting}>
              {submitting ? 'Placing order…' : 'Place Order'} <span className="ar">→</span>
            </button>
            {error && <p className="contact-msg err">{error}</p>}
            <p
              className="contact-msg"
              style={{ color: 'var(--m)', fontSize: 11, marginTop: 8 }}
            >
              Payment via POK (coming soon). For now, your order will be saved as pending.
            </p>
          </form>

          <aside className="checkout-summary">
            <h3>
              Order <em>Summary</em>
            </h3>
            {items.map((it) => (
              <div className="cs-line" key={`${it.productId}-${it.size}-${it.color}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image} alt={it.name} />
                <div>
                  <div className="name">{it.name}</div>
                  <div className="meta">
                    Size {it.size} · Qty {it.quantity}
                  </div>
                </div>
                <div className="price">{formatPrice(it.price * it.quantity)}</div>
              </div>
            ))}
            <div className="cs-totals">
              <div className="row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="row">
                <span>Shipping</span>
                <span>{SHIPPING_FEE === 0 ? 'Complimentary' : formatPrice(SHIPPING_FEE)}</span>
              </div>
              <div className="row total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}

import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { getAdminEmail } from '@/lib/auth';
import { listOrders } from '@/lib/db/orders';
import { dbReady } from '@/lib/prisma';
import { formatPriceCents, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const email = getAdminEmail();
  if (!email) redirect('/admin/login');

  const ready = dbReady();
  const orders = ready ? await listOrders(100) : [];

  return (
    <AdminShell>
      <h1>
        <em>Orders</em>
      </h1>

      {!ready ? (
        <div className="admin-empty">
          <p>
            <strong>Database not configured.</strong>
            <br />
            Set <code>DATABASE_URL</code> in your environment to start receiving orders.
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="admin-empty">
          <p>No orders yet — they&rsquo;ll appear here once the first one comes in.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'var(--sans)', letterSpacing: '0.04em' }}>
                    {o.orderNumber}
                  </td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td>
                    {o.customerName}
                    <div style={{ color: 'var(--m)', fontSize: 11 }}>{o.email}</div>
                  </td>
                  <td>{o.items.reduce((acc, it) => acc + it.quantity, 0)}</td>
                  <td>{formatPriceCents(o.totalCents, o.currency)}</td>
                  <td>
                    <span className={`pill ${o.status}`}>{o.status}</span>
                  </td>
                  <td>
                    <span className={`pill ${o.paymentStatus}`}>{o.paymentStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}

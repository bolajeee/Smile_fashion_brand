import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/layouts/Main';
import type { Order } from '@/types/order';

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!id) return;
      
      try {
        const res = await fetch(`/api/order/${id}`);
        if (!res.ok) {
          throw new Error('Order not found');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container">
          <div className="alert alert--error">
            <i className="icon-error" />
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container">
          <div className="alert alert--warning">
            <i className="icon-warning" />
            <p>Order not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div className="order-detail">
          <div className="order-detail__header">
            <h1>Order Details</h1>
            <span className="order-id">#{order.id.slice(0, 8)}</span>
          </div>

          <div className="order-detail__status">
            <span className={`status-badge status-badge--${order.status.toLowerCase()}`}>
              {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
            </span>
            <span className="order-date">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="order-detail__shipping">
            <h2>Shipping Address</h2>
            <div className="shipping-address">
              {order.shippingAddress.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          <div className="order-detail__items">
            <h2>Order Items</h2>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name || 'Product'}</td>
                    <td>{item.quantity}</td>
                    <td>${parseFloat(item.price.toString()).toFixed(2)}</td>
                    <td>${(item.quantity * parseFloat(item.price.toString())).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>Subtotal</td>
                  <td>${order.items.reduce((sum, item) => sum + (parseFloat(item.price.toString()) * item.quantity), 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={3}>Shipping</td>
                  <td>$0.00</td>
                </tr>
                <tr>
                  <td colSpan={3}><strong>Total</strong></td>
                  <td><strong>${parseFloat(order.total.toString()).toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="order-detail__actions">
            <button
              className="btn btn--primary"
              onClick={() => window.open(`/api/invoices/${order.id}`, '_blank')}
            >
              <i className="icon-send" /> Download Invoice
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

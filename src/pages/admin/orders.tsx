import { useEffect, useState } from 'react';
import Layout from '@/layouts/Main';
import { withAdminProtection } from '@/components/auth/withAdminProtection';
import type { Order } from '@/types/order';
import { OrderStatus } from '@/types/order';
import OrderTableSkeleton from '@/components/admin/OrderTableSkeleton';

function calculateTotal(orders: Order[]): number {
    return orders.reduce((sum, order) => {
        const orderTotal = typeof order.total === 'string' 
            ? parseFloat(order.total) 
            : Number(order.total);
        return sum + (isNaN(orderTotal) ? 0 : orderTotal);
    }, 0);
}

function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    

    useEffect(() => {
        async function load() {
            try {
                const [ordersRes, statusRes] = await Promise.all([
                    fetch('/api/orders'),
                    fetch('/api/order-status'),
                ]);
                if (!ordersRes.ok) throw new Error('Failed to load orders');
                if (!statusRes.ok) throw new Error('Failed to load statuses');
                const [ordersJson] = await Promise.all([
                    ordersRes.json(),
                    statusRes.json(),
                ]);
                setOrders(ordersJson);
            } catch (err: any) {
                setError(err.message || 'Error loading orders');
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);

    async function updateStatus(orderId: string, newStatus: OrderStatus) {
        try {
            const res = await fetch(`/api/order/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update order');
            }

            const updated = await res.json();
            setOrders(prev => prev.map(o => (o.id === updated.id ? updated : o)));
            
            // Show success message
            const message = document.createElement('div');
            message.className = 'toast toast--success';
            message.innerHTML = `<i class="icon-check"></i> Order status updated successfully`;
            document.body.appendChild(message);
            setTimeout(() => message.remove(), 3000);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error updating order');
        }
    }

    if (isLoading) {
        return (
            <Layout>
                <section className="admin-orders">
                    <div className="container">
                        <h1>Orders</h1>
                        <OrderTableSkeleton />
                    </div>
                </section>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <section className="admin-orders">
                    <div className="container">
                        <div className="alert alert--error">
                            <i className="icon-error" />
                            <p>{error}</p>
                        </div>
                    </div>
                </section>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="admin-orders">
                <div className="container">
                    <div className="admin-header">
                        <h1>Orders</h1>
                        <div className="admin-header__stats">
                            <div className="stat-card">
                                <span className="stat-card__value">{orders.length}</span>
                                <span className="stat-card__label">Total Orders</span>
                                <span className="stat-card__change">
                                    <i className="icon-trending-up" />
                                    +{orders.filter(o => {
                                        const orderDate = new Date(o.createdAt);
                                        const today = new Date();
                                        return orderDate.getDate() === today.getDate();
                                    }).length} today
                                </span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-card__value">
                                    ${calculateTotal(orders).toFixed(2)}
                                </span>
                                <span className="stat-card__label">Total Revenue</span>
                                <span className="stat-card__change">
                                    <i className="icon-dollar" />
                                    ${calculateTotal(orders.filter(o => {
                                        const orderDate = new Date(o.createdAt);
                                        const today = new Date();
                                        return orderDate.getDate() === today.getDate();
                                    })).toFixed(2)} today
                                </span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-card__value">
                                    {orders.filter(o => o.status === OrderStatus.PENDING).length}
                                </span>
                                <span className="stat-card__label">Pending Orders</span>
                                <span className="stat-card__change">
                                    <i className="icon-time" />
                                    {orders.filter(o => o.status === OrderStatus.PROCESSING).length} processing
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="orders-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Customer Details</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Order Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>
                                            <span className="order-id" title={order.id}>
                                                #{order.id.slice(0, 8)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="customer-info">
                                                {order.shippingAddress.split('\n').map((line, i) => (
                                                    <span key={i} className={i === 0 ? 'customer-name' : 'customer-address'}>
                                                        {line}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="order-items">
                                                <span className="order-items__count">{order.items.length}</span>
                                                <div className="order-items__tooltip">
                                                    {order.items.map((item, i) => (
                                                        <div key={i} className="order-item">
                                                            <span>{item.name || 'Product'}</span>
                                                            <span>×{item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-primary">
                                            ${(typeof order.total === 'number' ? order.total : parseFloat(String(order.total))).toFixed(2)}
                                        </td>
                                        <td>
                                            <span className={`status-badge status-badge--${order.status.toLowerCase()}`}>
                                                {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="order-date">
                                                <span className="order-date__full">
                                                    {new Date(order.createdAt).toLocaleString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                <span className="order-date__relative">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <select
                                                    className="select-status"
                                                    value={order.status}
                                                    onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                                                >
                                                    {Object.values(OrderStatus).map(status => (
                                                        <option key={status} value={status}>
                                                            {status.charAt(0) + status.slice(1).toLowerCase()}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    className="btn btn--icon"
                                                    title="View Order Details"
                                                    onClick={() => window.open(`/order/${order.id}`, '_blank')}
                                                >
                                                    <i className="icon-search" />
                                                </button>
                                                <button
                                                    className="btn btn--icon"
                                                    title="Download Invoice"
                                                    onClick={() => window.open(`/api/invoices/${order.id}`, '_blank')}
                                                >
                                                    <i className="icon-send" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default withAdminProtection(AdminOrdersPage);

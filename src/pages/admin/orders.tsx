import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../../layouts/Main';

type OrderItem = {
    id: string;
    productId: string;
    quantity: number;
    price: number;
};

type Order = {
    id: string;
    userId: string;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    total: number;
    shippingAddress: string;
    createdAt: string;
    items: OrderItem[];
};

export default function AdminOrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [statuses, setStatuses] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/login');
        } else if (session?.user?.role !== 'ADMIN') {
            router.replace('/');
        }
    }, [status, session, router]);

    useEffect(() => {
        async function load() {
            try {
                const [ordersRes, statusRes] = await Promise.all([
                    fetch('/api/orders'),
                    fetch('/api/order-status'),
                ]);
                if (!ordersRes.ok) throw new Error('Failed to load orders');
                if (!statusRes.ok) throw new Error('Failed to load statuses');
                const [ordersJson, statusesJson] = await Promise.all([
                    ordersRes.json(),
                    statusRes.json(),
                ]);
                setOrders(ordersJson);
                setStatuses(statusesJson);
            } catch (err: any) {
                setError(err.message || 'Error loading orders');
            } finally {
                setIsLoading(false);
            }
        }
        if (session?.user?.role === 'ADMIN') {
            load();
        }
    }, [session]);

    async function updateStatus(orderId: string, status: string) {
        try {
            const res = await fetch(`/api/order/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error('Failed to update order');
            const updated = await res.json();
            setOrders(prev => prev.map(o => (o.id === updated.id ? updated : o)));
        } catch (err: any) {
            alert(err.message || 'Error updating order');
        }
    }

    if (status === 'loading' || isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Layout>
            <section className="admin-orders">
                <div className="container">
                    <h1>Orders</h1>
                    <div className="orders-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.id.slice(0, 8)}...</td>
                                        <td>${order.total}</td>
                                        <td>{order.status}</td>
                                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                                        <td>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                            >
                                                {statuses.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
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



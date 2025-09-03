import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../../layouts/Main';

type Metrics = {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
};

export default function AdminDashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [metrics, setMetrics] = useState<Metrics | null>(null);
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
        async function loadMetrics() {
            try {
                const res = await fetch('/api/admin/stats');
                if (!res.ok) {
                    throw new Error('Failed to load metrics');
                }
                const data = await res.json();
                setMetrics(data);
            } catch (err: any) {
                setError(err.message || 'Error loading metrics');
            } finally {
                setIsLoading(false);
            }
        }
        if (session?.user?.role === 'ADMIN') {
            loadMetrics();
        }
    }, [session]);

    if (status === 'loading' || isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!metrics) return null;

    return (
        <Layout>
            <section className="admin-dashboard">
                <div className="container">
                    <h1>Admin Dashboard</h1>
                    <div className="dashboard-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                        <div className="card"><h3>Orders</h3><p>{metrics.totalOrders}</p></div>
                        <div className="card"><h3>Revenue</h3><p>${metrics.totalRevenue.toFixed(2)}</p></div>
                        <div className="card"><h3>Products</h3><p>{metrics.totalProducts}</p></div>
                        <div className="card"><h3>Users</h3><p>{metrics.totalUsers}</p></div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}



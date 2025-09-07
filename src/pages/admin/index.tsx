import { useEffect, useState } from 'react';
import Layout from '@/layouts/Main';
import { withAdminProtection } from '@/components/auth/withAdminProtection';
import Link from 'next/link';

type Metrics = {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
};

function AdminDashboardPage() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        loadMetrics();
    }, []);

    if (isLoading) {
        return (
            <Layout>
                <div className="container">
                    <div>Loading...</div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="container">
                    <div>Error: {error}</div>
                </div>
            </Layout>
        );
    }

    if (!metrics) return null;

    return (
        <Layout>
            <section className="admin-dashboard">
                <div className="container">
                    <h1 className="admin-dashboard__title">Admin Dashboard</h1>
                    
                    {/* Metrics Cards */}
                    <div className="admin-dashboard__cards">
                        <div className="admin-dashboard__metric-card admin-dashboard__metric-card--orders">
                            <h3>Total Orders</h3>
                            <p>{metrics.totalOrders}</p>
                        </div>
                        <div className="admin-dashboard__metric-card admin-dashboard__metric-card--revenue">
                            <h3>Total Revenue</h3>
                            <p>${metrics.totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="admin-dashboard__metric-card admin-dashboard__metric-card--products">
                            <h3>Total Products</h3>
                            <p>{metrics.totalProducts}</p>
                        </div>
                        <div className="admin-dashboard__metric-card admin-dashboard__metric-card--users">
                            <h3>Total Users</h3>
                            <p>{metrics.totalUsers}</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <h2 className="admin-dashboard__title">Quick Actions</h2>
                    <div className="admin-dashboard__nav-cards">
                        <Link href="/admin/products" className="admin-dashboard__nav-card">
                            <span className="icon">🛍️</span>
                            <h3>Products</h3>
                            <p>Manage your product catalog</p>
                        </Link>
                        <Link href="/admin/featured/products" className="admin-dashboard__nav-card">
                            <span className="icon">⭐</span>
                            <h3>Featured Products</h3>
                            <p>Manage featured items</p>
                        </Link>
                        <Link href="/admin/orders" className="admin-dashboard__nav-card">
                            <span className="icon">📦</span>
                            <h3>Orders</h3>
                            <p>View and manage orders</p>
                        </Link>
                        <Link href="/admin/settings" className="admin-dashboard__nav-card">
                            <span className="icon">⚙️</span>
                            <h3>Settings</h3>
                            <p>Manage users and preferences</p>
                        </Link>
                        <Link href="/admin/products/add" className="admin-dashboard__nav-card">
                            <span className="icon">➕</span>
                            <h3>Add Product</h3>
                            <p>Create a new product</p>
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export default withAdminProtection(AdminDashboardPage);
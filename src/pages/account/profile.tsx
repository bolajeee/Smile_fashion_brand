import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../layouts/Main';
import type { Order, OrderStatus } from '@/types/order';
import type { UserProfile } from '@/types/auth';

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/account/orders?userId=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setOrders(data);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
      setIsLoading(false);
    };

    fetchOrders();
  }, [session?.user?.id]);

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <section className="profile-page">
        <div className="container">
          <div className="profile-header">
            <h1>My Profile</h1>
            <button onClick={() => signOut()} className="btn btn--rounded btn--yellow">
              Sign Out
            </button>
          </div>

          <div className="profile-content">
            <div className="profile-info">
              <h2>Account Information</h2>
              <p><strong>Name:</strong> {session.user.name}</p>
              <p><strong>Email:</strong> {session.user.email}</p>
              <Link href="/account/edit-profile" className="btn btn--rounded">
                Edit Profile
              </Link>
            </div>

            <div className="order-history">
              <h2>Order History</h2>
              {orders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-item">
                      <div className="order-header">
                        <h3>Order #{order.id}</h3>
                        <span className={`order-status status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-details">
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                      </div>
                      <div className="order-items">
                        <h4>Items ({order.items.length})</h4>
                        {order.items.map((item) => (
                          <div key={item.id} className="order-item-detail">
                            <p>Product ID: {item.productId}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProfilePage;

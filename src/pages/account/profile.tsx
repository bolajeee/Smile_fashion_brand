import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../layouts/Main';
import type { Order, OrderStatus } from '@/types/order';
import type { UserProfile } from '@/types/auth';

const ProfilePage = () => {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/account/profile');
          if (response.ok) {
            const data = await response.json();
            setProfile(data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

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

    fetchProfile();
    fetchOrders();
  }, [session?.user?.id]);

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>;
  }

  if (!session || !profile) {
    return null;
  }

  const getStatusClass = (status: OrderStatus) => {
    return `order-item__status order-item__status--${status.toLowerCase()}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload image');
      }

      const { url } = await uploadRes.json();

      // Update user profile with new image URL
      const updateRes = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: url }),
      });

      if (!updateRes.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await updateRes.json();
      setProfile(updatedProfile);
      
      // Update session to reflect the new image
      await updateSession({
        ...session,
        user: {
          ...session.user,
          image: url,
        },
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      // Here you should show an error message to the user
    }
  };

  return (
    <Layout>
      <section className="profile-page">
        <div className="container">
          <div className="profile-header">
            <h1>My Profile</h1>
            <button onClick={() => signOut()} className="btn btn--rounded btn--border">
              <i className="icon-exit" /> Sign Out
            </button>
          </div>

          <div className="profile-content">
            <div className="profile-info">
              <div className="profile-info__avatar">
                {profile.image ? (
                  <img src={profile.image} alt={profile.name || ''} />
                ) : (
                  <div className="profile-info__avatar-placeholder">
                    {getInitials(profile.name || 'U')}
                  </div>
                )}
                <label htmlFor="avatar-upload" className="profile-info__avatar-edit">
                  <i className="icon-camera" /> Change Photo
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </div>

              <h2 className="profile-info__name">{profile.name}</h2>
              <p className="profile-info__email">{profile.email}</p>

              <div className="profile-info__stats">
                <div className="profile-info__stats-item">
                  <span>{orders.length}</span>
                  <small>Orders</small>
                </div>
                <div className="profile-info__stats-item">
                  <span>${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</span>
                  <small>Spent</small>
                </div>
              </div>

              <Link href="/account/edit-profile" className="btn btn--rounded btn--primary">
                <i className="icon-edit" /> Edit Profile
              </Link>
            </div>

            <div className="order-history">
              <h2>Order History</h2>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <i className="icon-bag" />
                  <p>No orders found</p>
                  <Link href="/product" className="btn btn--rounded btn--primary">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-item">
                      <div className="order-item__header">
                        <h3>Order #{order.id}</h3>
                        <span className={getStatusClass(order.status)}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="order-item__details">
                        <div className="order-item__details-item">
                          <span>Order Date</span>
                          <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
                        </div>
                        <div className="order-item__details-item">
                          <span>Items</span>
                          <strong>{order.items.length}</strong>
                        </div>
                        <div className="order-item__details-item">
                          <span>Total Amount</span>
                          <strong>${order.total.toFixed(2)}</strong>
                        </div>
                      </div>

                      <div className="order-item__products">
                        <h4>Products</h4>
                        <div className="order-item__products-list">
                          {order.items.map((item) => (
                            <div key={item.id} className="order-item__products-item">
                              <img 
                                src={item.image || '/images/products/placeholder.jpg'} 
                                alt={item.name || `Product ${item.productId}`}
                              />
                              <div className="order-item__products-item-info">
                                <h5>{item.name || `Product ${item.productId}`}</h5>
                                <p>Quantity: {item.quantity}</p>
                              </div>
                              <div className="order-item__products-item-price">
                                ${item.price.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
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

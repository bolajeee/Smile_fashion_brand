import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';
import api from '@/utils/api-client';
import Layout from '../../layouts/Main';
import type { Order } from '@/types/order';
import { OrderStatus } from '@/types/order';
import type { User } from '@/types/auth';
import ProfileSkeleton from '@/components/auth/ProfileSkeleton';
import OrderSkeleton from '@/components/auth/OrderSkeleton';

import ErrorBoundary from '@/components/error-boundary';

const ProfileContent = () => {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<User | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        try {
          const { data } = await api.get('/api/account/profile');
          setProfile(data);
        } catch (error: any) {
          Sentry.captureException(error, {
            extra: {
              component: 'ProfilePage',
              action: 'fetchProfile',
            },
          });
          setUploadError(error.message || 'Failed to load profile. Please try again.');
        }
      }
    };

    const fetchOrders = async () => {
      if (session?.user?.id) {
        try {
          const { data } = await api.get(`/api/account/orders`, {
            params: { userId: session.user.id }
          });
          setOrders(data);
        } catch (error: any) {
          Sentry.captureException(error, {
            extra: {
              component: 'ProfilePage',
              action: 'fetchOrders',
              userId: session.user.id,
            },
          });
          setUploadError(error.message || 'Failed to load orders');
        }
      }
      setIsLoading(false);
    };

    fetchProfile();
    fetchOrders();
  }, [session?.user?.id]);

  if (status === 'loading' || isLoading) {
    return (
      <Layout>
        <section className="profile-page">
          <div className="container">
            <div className="profile-header">
              <h1>My Profile</h1>
            </div>
            <div className="profile-content loading">
              <ProfileSkeleton />
              <div className="orders-skeleton">
                {[1, 2, 3].map((i) => (
                  <OrderSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
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

    setIsUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Upload image
      const { data: { url } } = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update user profile with new image URL
      const { data: updatedProfile } = await api.put('/api/account/profile', {
        image: url,
      });

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
      setUploadError('Failed to update profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReorder = async (order: Order) => {
    try {
      // Add items to cart
      // This is a placeholder - implement your cart logic here
      console.log('Reordering items from order:', order.id);
      router.push('/cart');
    } catch (error) {
      console.error('Error reordering:', error);
    }
  };

  const handleDownloadInvoice = async (order: Order) => {
    try {
      const response = await api.get(`/api/invoices/${order.id}`, {
        responseType: 'blob'
      });

      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error('Invalid invoice format');
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          component: 'ProfilePage',
          action: 'downloadInvoice',
          orderId: order.id,
        },
      });
      setUploadError(error.message || 'Failed to download invoice');
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setActiveOrderId(activeOrderId === orderId ? null : orderId);
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
              <div className={`profile-info__avatar ${isUploading ? 'is-uploading' : ''}`}>
                {profile.image ? (
                  <img src={profile.image} alt={profile.name || ''} />
                ) : (
                  <div className="profile-info__avatar-placeholder">
                    {getInitials(profile.name || 'U')}
                  </div>
                )}
                <label 
                  htmlFor="avatar-upload" 
                  className="profile-info__avatar-edit"
                  aria-disabled={isUploading}
                  style={{ willChange: isUploading ? 'opacity' : 'auto' }}
                >
                  {isUploading ? (
                    <><i className="icon-spinner animate-spin" /> Uploading...</>
                  ) : (
                    <><i className="icon-camera" /> Change Photo</>
                  )}
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>

              {uploadError && (
                <div className="alert alert--error">
                  <i className="icon-error" />
                  {uploadError}
                </div>
              )}

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
                        <div className="order-item__header-main">
                          <h3>Order #{order.id}</h3>
                          <span className={getStatusClass(order.status)}>
                            {order.status}
                          </span>
                        </div>
                        <div className="order-item__header-sub">
                          <time>{new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</time>
                        </div>
                      </div>
                      
                      {order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED && (
                        <div className="order-progress">
                          <div className={`order-progress__bar order-progress__bar--${order.status.toLowerCase()}`} />
                          <div className="order-progress__steps">
                            <div className={`order-progress__step ${
                              order.status === OrderStatus.PENDING ? 'is-active' : 'is-complete'
                            }`}>
                              <div className="order-progress__step-icon">
                                <i className="icon-check" />
                              </div>
                              <span>Order Placed</span>
                            </div>
                            <div className={`order-progress__step ${
                              order.status === OrderStatus.PROCESSING ? 'is-active' : 
                              (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) ? 'is-complete' : ''
                            }`}>
                              <div className="order-progress__step-icon">
                                <i className="icon-box" />
                              </div>
                              <span>Processing</span>
                            </div>
                            <div className={`order-progress__step ${
                              order.status === OrderStatus.SHIPPED ? 'is-active' :
                              order.status === OrderStatus.DELIVERED ? 'is-complete' : ''
                            }`}>
                              <div className="order-progress__step-icon">
                                <i className="icon-truck" />
                              </div>
                              <span>Shipped</span>
                            </div>
                            <div className={`order-progress__step ${
                              order.status === OrderStatus.DELIVERED ? 'is-active' : ''
                            }`}>
                              <div className="order-progress__step-icon">
                                <i className="icon-check-circle" />
                              </div>
                              <span>Delivered</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="order-item__details">
                        <div className="order-item__details-item">
                          <span>Items</span>
                          <strong>{order.items.length}</strong>
                        </div>
                        <div className="order-item__details-item">
                          <span>Total Amount</span>
                          <strong className="text-primary">${order.total.toFixed(2)}</strong>
                        </div>
                        <div className="order-item__details-item">
                          <button 
                            className="btn btn--text btn--sm"
                            onClick={() => toggleOrderDetails(order.id)}
                            aria-expanded={activeOrderId === order.id}
                          >
                            {activeOrderId === order.id ? 'Hide Details' : 'View Details'}{' '}
                            <i className={`icon-chevron-down ${activeOrderId === order.id ? 'is-rotated' : ''}`} />
                          </button>
                        </div>
                      </div>

                      <div 
                        className={`order-item__products ${activeOrderId === order.id ? 'is-expanded' : ''}`}
                        aria-hidden={activeOrderId !== order.id}
                      >
                        <div className="order-item__products-header">
                          <h4>Products</h4>
                          <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="order-item__products-list">
                          {order.items.map((item) => (
                            <div key={item.id} className="order-item__products-item">
                              <div className="order-item__products-item-image">
                                <img 
                                  src={item.image || '/images/products/placeholder.jpg'} 
                                  alt={item.name || `Product ${item.productId}`}
                                />
                              </div>
                              <div className="order-item__products-item-info">
                                <h5>{item.name || `Product ${item.productId}`}</h5>
                                <p>Quantity: {item.quantity}</p>
                              </div>
                              <div className="order-item__products-item-price">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="order-item__footer">
                        <div className="order-item__footer-total">
                          <span>Order Total</span>
                          <strong>${order.total.toFixed(2)}</strong>
                        </div>
                        <div className="order-item__footer-actions">
                          {order.status === OrderStatus.DELIVERED && (
                            <button 
                              className="btn btn--text btn--sm"
                              onClick={() => handleReorder(order)}
                            >
                              <i className="icon-repeat" /> Reorder
                            </button>
                          )}
                          <button 
                            className="btn btn--primary btn--sm"
                            onClick={() => handleDownloadInvoice(order)}
                          >
                            <i className="icon-download" /> Download Invoice
                          </button>
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

const ProfilePage = () => {
  return (
    <ErrorBoundary>
      <ProfileContent />
    </ErrorBoundary>
  );
};

export default ProfilePage;

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUI } from '@/contexts/UIContext';
import Layout from '../../layouts/Main';

const EditProfilePage = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { addNotification } = useUI();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (session?.user) {
      const fetchProfile = async () => {
        try {
          const response = await fetch('/api/account/profile');
          if (response.ok) {
            const data = await response.json();
            setFormData(prev => ({
              ...prev,
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              address: data.address || ''
            }));
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          addNotification({
            type: 'error',
            message: 'Failed to load profile data',
            duration: 3000
          });
        }
      };

      fetchProfile();
    }
  }, [status, router, session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setIsLoading(true);

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
        body: JSON.stringify({ ...formData, image: url }),
      });

      if (!updateRes.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await updateRes.json();
      
      // Update session with new image
      await update(updatedProfile);

      addNotification({
        type: 'success',
        message: 'Profile photo updated successfully!',
        duration: 3000
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update profile photo',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        await update(data); // Update the session with new data
        addNotification({
          type: 'success',
          message: 'Profile updated successfully!',
          duration: 3000
        });
        router.push('/account/profile');
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update profile',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
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
            <h1>Edit Profile</h1>
            <button
              onClick={() => router.back()}
              className="btn btn--rounded btn--border"
            >
              <i className="icon-arrow-left" /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="edit-profile-form">
            <div className="edit-profile-form__avatar">
              <div className="profile-info__avatar">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || ''} />
                ) : (
                  <div className="profile-info__avatar-placeholder">
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
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
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-divider">
              <span>Change Password</span>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn--rounded btn--border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn--rounded btn--primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="icon-loading animate-spin" /> Updating...
                  </>
                ) : (
                  <>
                    <i className="icon-check" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default EditProfilePage;

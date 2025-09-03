import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/layouts/Main';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  address?: string;
  createdAt: string;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

const AdminSettingsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (session?.user?.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleToggleRole = async (user: User) => {
    try {
      const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
      const res = await fetch(`/api/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          role: newRole,
        }),
      });

      if (!res.ok) throw new Error('Failed to update user role');

      setUsers(users.map(u => 
        u.id === user.id 
          ? { ...u, role: newRole }
          : u
      ));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <Layout>
        <div className="container mt-8">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mt-8">
          <p className="text-red-500">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <Layout>
      <section className="admin-settings">
        <div className="container">
          <h1 className="admin-settings__title">User Management</h1>

          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        onClick={() => handleToggleRole(user)}
                        className={`btn btn--sm btn--rounded ${
                          user.role === 'ADMIN' 
                            ? 'btn--yellow' 
                            : 'btn--border'
                        }`}
                      >
                        {user.role}
                      </button>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="btn btn--sm btn--rounded btn--danger"
                        disabled={user.id === session.user.id}
                      >
                        Delete
                      </button>
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
};

export default AdminSettingsPage;

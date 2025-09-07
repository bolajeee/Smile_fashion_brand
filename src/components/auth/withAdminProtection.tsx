import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/layouts/Main';

export function withAdminProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  return function ProtectedRoute(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      console.log('Auth Debug:', {
        status,
        session,
        userRole: session?.user?.role,
        timestamp: new Date().toISOString()
      });

      if (status === 'loading') {
        // Don't do anything while loading
        return;
      }

      if (status === 'unauthenticated') {
        console.log('Redirecting to login - unauthenticated');
        router.replace('/login');
      } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
        console.log('Redirecting to home - not admin');
        router.replace('/');
      }
    }, [status, session, router]);

    if (status === 'loading') {
      return (
        <Layout>
          <div className="container">
            <div>Loading...</div>
          </div>
        </Layout>
      );
    }

    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

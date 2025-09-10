import { useState } from 'react';
import { useRouter } from 'next/router';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) {
        setSuccess('Your password has been reset. You can now log in.');
      } else {
        setError('Invalid or expired token. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="btn btn--rounded btn--yellow" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          {success && <div className="auth-success">{success}</div>}
          {error && <div className="auth-error">{error}</div>}
        </form>
      </div>
      <style jsx>{`
        .auth-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff9f3;
        }
        .auth-form-container {
          background: #fff;
          padding: 32px 24px;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          max-width: 400px;
          width: 100%;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .auth-input {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
        }
        .auth-success {
          color: #27ae60;
          text-align: center;
        }
        .auth-error {
          color: #e74c3c;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;

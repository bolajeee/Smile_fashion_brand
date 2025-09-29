import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ResetPasswordPage = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | undefined>(undefined);
  // Sync token from router.query when ready

  useEffect(() => {
    if (router.isReady) {
      const t = router.query.token;
      setToken(typeof t === 'string' ? t : undefined);
    }
  }, [router.isReady, router.query.token]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    // Debug log for token value
    console.log('DEBUG: Token value before submit:', token);
    if (!token) {
      setError('Reset token is missing. Please use the link from your email.');
      return;
    }
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-reset-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      setSuccess('Your password has been reset. You can now log in.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h1 className="reset-password-title">Reset Password</h1>
        <form onSubmit={handleSubmit} className="reset-password-form">
          {/* Hidden username field for accessibility/autofill */}
          <input
            type="text"
            name="username"
            autoComplete="username"
            style={{ display: 'none' }}
            tabIndex={-1}
          />
          <label htmlFor="new-password" className="reset-password-label">New password</label>
          <input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="reset-password-input"
            autoComplete="new-password"
          />
          <label htmlFor="confirm-password" className="reset-password-label">Confirm new password</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="reset-password-input"
            autoComplete="new-password"
          />
          <button type="submit" className="reset-password-btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          {success && <div className="reset-password-success">{success}</div>}
          {error && <div className="reset-password-error">{error}</div>}
        </form>
      </div>
      <style jsx>{`
        .reset-password-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-home-section, #181c24);
        }
        .reset-password-container {
          background: var(--card-bg-dark, #23262a);
          padding: 32px 24px;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12);
          max-width: 400px;
          width: 100%;
        }
        .reset-password-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--color-text-primary, #f3f4f6);
          text-align: center;
        }
        .reset-password-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .reset-password-label {
          font-size: 1rem;
          color: var(--color-text-secondary, #9ca3af);
          margin-bottom: 0.25rem;
        }
        .reset-password-input {
          padding: 12px 16px;
          border: 1px solid var(--color-border, #e2e8f0);
          border-radius: 8px;
          font-size: 1rem;
          background: var(--input-bg-dark, #10141c);
          color: var(--color-text-primary, #f3f4f6);
        }
        .reset-password-input:focus {
          border-color: var(--primary-color, #6366f1);
          outline: none;
        }
        .reset-password-btn {
          background: var(--primary-color, #6366f1);
          color: #fff;
          padding: 12px 0;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .reset-password-btn:disabled {
          background: #888;
          cursor: not-allowed;
        }
        .reset-password-success {
          color: #22c55e;
          text-align: center;
          margin-top: 1rem;
        }
        .reset-password-error {
          color: #e74c3c;
          text-align: center;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;

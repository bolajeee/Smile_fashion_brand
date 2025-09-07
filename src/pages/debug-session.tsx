import { useSession } from 'next-auth/react';

export default function DebugSession() {
  const { data: session, status } = useSession();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Session Debug</h1>
      <pre>
        {JSON.stringify({ session, status }, null, 2)}
      </pre>
    </div>
  );
}

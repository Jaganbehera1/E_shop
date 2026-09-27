import { Component, ReactNode } from 'react';

interface State { error: Error | null }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const isMissingEnv =
      error.message.includes('Supabase') ||
      error.message.includes('VITE_SUPABASE');

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'Inter, system-ui, sans-serif',
          background: '#0b1220',
          color: '#e2e8f0',
        }}
      >
        <div style={{ maxWidth: 560, width: '100%' }}>
          <div
            style={{
              background: '#111a2e',
              border: '1px solid #1e293b',
              borderRadius: '1rem',
              padding: '2rem',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>
              {isMissingEnv ? '🔑' : '⚠️'}
            </div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
              }}
            >
              {isMissingEnv
                ? 'Supabase credentials missing'
                : 'Something went wrong'}
            </h1>

            {isMissingEnv ? (
              <>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  The app needs your Supabase project credentials to connect to
                  the database. Follow these steps:
                </p>
                <ol style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
                  <li>Open your Supabase project at <strong style={{ color: '#60a5fa' }}>supabase.com</strong></li>
                  <li>Go to <strong>Settings → API</strong></li>
                  <li>Copy the <strong>Project URL</strong> and <strong>anon public</strong> key</li>
                  <li>
                    Create a <code style={{ background: '#1e293b', padding: '1px 6px', borderRadius: 4 }}>.env</code>{' '}
                    file in the project root:
                  </li>
                </ol>
                <pre
                  style={{
                    background: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: 8,
                    padding: '1rem',
                    fontSize: '0.8rem',
                    color: '#67e8f9',
                    marginTop: '1rem',
                    overflowX: 'auto',
                  }}
                >
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`}
                </pre>
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '1rem' }}>
                  After adding the file, restart the dev server with{' '}
                  <code style={{ background: '#1e293b', padding: '1px 6px', borderRadius: 4 }}>npm run dev</code>.
                </p>
              </>
            ) : (
              <>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {error.message}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Reload page
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Cpu, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useToast } from '../lib/toast';
import { Seo } from '../lib/seo';
import { supabase } from '../lib/supabase';

export function AuthPage() {
  const [sp] = useSearchParams();
  const next = sp.get('next') ?? '/dashboard';
  const nav = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if an email already exists in auth.users.
  // Uses a SECURITY DEFINER RPC to avoid leaking data.
  const emailExists = async (em: string): Promise<boolean> => {
    const { data } = await supabase.rpc('email_exists', { check_email: em });
    return data === true;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (tab === 'in') {
      // Attempt sign in
      const res = await signIn(email, password);
      if (res.error) {
        // Login failed — check if the email is even registered
        const exists = await emailExists(email);
        if (!exists) {
          // Email not found — switch to signup and notify
          toast('No account found with this email. Please sign up first.', 'error');
          setTab('up');
          setLoading(false);
          return;
        }
        // Email exists but wrong password
        toast('Incorrect password. Please try again.', 'error');
        setLoading(false);
        return;
      }
      // Login succeeded — check if admin
      const { data: isAdmin } = await supabase.rpc('is_admin');
      if (isAdmin === true) {
        toast('Welcome back, Admin!');
        nav('/admin');
        return;
      }
      toast('Signed in!');
      nav(next);
    } else {
      // Sign up
      if (!name.trim()) {
        toast('Please enter your full name', 'error');
        setLoading(false);
        return;
      }
      const res = await signUp(email, password, name, phone);
      setLoading(false);
      if (res.error) { toast(res.error, 'error'); return; }
      toast('Account created! You are now signed in.');
      nav(next);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
      <Seo title={tab === 'in' ? 'Sign in' : 'Create account'} path="/auth" />
      <div className="w-full max-w-md fade">
        <div className="mb-8 text-center">
          <Link to="/">
            <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-[#2874f0] text-white shadow-xl shadow-[#2874f0]/25">
              <Cpu className="h-7 w-7" />
            </span>
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold">
            {tab === 'in' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="mt-1 text-sm text-[var(--soft)]">
            {tab === 'in' ? 'Sign in to track orders, manage projects and checkout faster.' : 'Join us to shop electronics and project kits.'}
          </p>
        </div>

        <div className="surface p-6 sm:p-8">
          {/* Tabs */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-[var(--surface2)] p-1">
            <button
              onClick={() => setTab('in')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${tab === 'in' ? 'bg-[#2874f0] text-white shadow-sm' : 'text-[var(--muted)]'}`}
            >
              <LogIn className="h-4 w-4" /> Sign in
            </button>
            <button
              onClick={() => setTab('up')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${tab === 'up' ? 'bg-[#2874f0] text-white shadow-sm' : 'text-[var(--muted)]'}`}
            >
              <UserPlus className="h-4 w-4" /> Sign up
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {tab === 'up' && (
              <>
                <Field icon={User} label="Full name" value={name} onChange={setName} placeholder="Your full name" required />
                <Field icon={Phone} label="Phone" value={phone} onChange={setPhone} placeholder="+91 98765 43210" />
              </>
            )}
            <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="input pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[#2874f0]"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Please wait…
                </span>
              ) : tab === 'in' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {tab === 'in' && (
            <p className="mt-4 text-center text-xs text-[var(--muted)]">
              Are you an admin?{' '}
              <Link to="/admin-login" className="font-semibold text-[#2874f0] hover:underline">
                Admin login →
              </Link>
            </p>
          )}
          {tab === 'up' && (
            <p className="mt-4 text-center text-xs text-[var(--muted)]">
              Already have an account?{' '}
              <button onClick={() => setTab('in')} className="font-semibold text-[#2874f0] hover:underline">
                Sign in →
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon, label, value, onChange, type = 'text', required, placeholder,
}: {
  icon: any; label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
        <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder} className="input pl-9" />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useToast } from '../lib/toast';
import { supabase } from '../lib/supabase';
import { Seo } from '../lib/seo';

export function AdminLoginPage() {
  const nav = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast(error, 'error');
      setLoading(false);
      return;
    }
    // Confirm this account is actually an admin via the is_admin() RPC
    // which bypasses RLS (SECURITY DEFINER + row_security=off)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: isAdmin, error: rpcErr } = await supabase.rpc('is_admin');
      if (isAdmin === true) {
        // Fetch the name separately for the welcome toast
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();
        toast(`Welcome, ${profile?.full_name ?? 'Admin'}!`);
        nav('/admin');
        setLoading(false);
        return;
      } else {
        // Not an admin — sign them out and reject
        await supabase.auth.signOut();
        toast('Access denied. This portal is for admins only.', 'error');
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    toast('Something went wrong.', 'error');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <Seo title="Admin Login" path="/admin-login" />

      <div className="w-full max-w-md fade">
        {/* Logo / brand */}
        <div className="mb-8 text-center">
          <span className="inline-grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-2xl shadow-brand-700/40">
            <ShieldCheck className="h-8 w-8" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold text-white">Admin Portal</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Restricted access — authorised personnel only.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  autoComplete="username"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 pl-9 text-sm text-white placeholder:text-slate-500 outline-none transition focus:ring-2 focus:ring-brand-500/40"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 pl-9 pr-10 text-sm text-white placeholder:text-slate-500 outline-none transition focus:ring-2 focus:ring-brand-500/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-brand-400 transition"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verifying…
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" /> Sign in as Admin
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link
            to="/auth"
            className="inline-flex items-center gap-1 font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to customer login
          </Link>
        </p>
      </div>
    </div>
  );
}

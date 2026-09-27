import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, Sun, Moon, ShieldCheck, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useTheme } from '../lib/theme';
import { useCart } from '../lib/cart';
import { useAuth } from '../lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { cx } from '../lib/utils';

const NAV = [
  { to: '/', l: 'Home' },
  { to: '/products', l: 'Products' },
  { to: '/project-solutions', l: 'Projects' },
  { to: '/services', l: 'Services' },
  { to: '/blog', l: 'Blog' },
  { to: '/contact', l: 'Contact' },
];

export function Header() {
  const { theme, toggle } = useTheme();
  const { count } = useCart();
  const { user, profile, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const nav = useNavigate();

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) nav(`/products?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#2874f0] text-white shadow-md">
      {/* Top bar */}
      <div className="cx flex h-14 items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 flex-col items-start leading-none">
          <span className="text-xl font-bold italic tracking-tight">Jagan<span className="text-[#f0c14b]">.</span></span>
          <span className="text-[10px] font-medium text-white/80">Electronics Hub</span>
        </Link>

        {/* Search */}
        <form onSubmit={search} className="relative ml-2 hidden flex-1 md:block">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search for products, brands and more"
            className="w-full rounded-md bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none"
          />
          <button type="submit" className="absolute right-0 top-0 h-full rounded-r-md bg-[#ff9f00] px-3">
            <Search className="h-4 w-4 text-white" />
          </button>
        </form>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1">
          <button onClick={toggle} className="rounded-md p-2 hover:bg-white/10" title="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenu(v => !v)}
                className="flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium hover:bg-white/10"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{profile?.full_name?.split(' ')[0] ?? 'Account'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {userMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-lg bg-white text-slate-800 shadow-xl border border-slate-200 py-1">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold truncate">{profile?.full_name ?? user.email}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50">
                      <LayoutDashboard className="h-4 w-4 text-slate-500" /> My Dashboard
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#2874f0] font-semibold hover:bg-slate-50">
                        <ShieldCheck className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { setUserMenu(false); signOut(); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-rose-500 hover:bg-slate-50"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/auth" className="rounded-md bg-white px-6 py-2 text-sm font-bold text-[#2874f0] hover:bg-slate-50">
              Login
            </Link>
          )}

          <Link to="/wishlist" className="rounded-md p-2 hover:bg-white/10 relative">
            <Heart className="h-4 w-4" />
          </Link>

          <Link to="/cart" className="rounded-md p-2 hover:bg-white/10 relative">
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#ff9f00] px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <button className="rounded-md p-2 lg:hidden" onClick={() => setOpen(o => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="cx pb-2 md:hidden">
        <form onSubmit={search} className="relative">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-md bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none"
          />
        </form>
      </div>

      {/* Category nav bar */}
      <div className="cx hidden items-center gap-1 border-t border-white/10 py-1.5 text-xs font-medium lg:flex">
        {NAV.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === '/'}
            className={({ isActive }) =>
              cx('rounded px-3 py-1.5 transition hover:bg-white/10', isActive ? 'bg-white/15 font-semibold' : 'text-white/90')
            }
          >
            {n.l}
          </NavLink>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <div className="cx flex flex-col gap-1 py-2">
              {NAV.map(n => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === '/'}
                  onClick={() => setOpen(false)}
                  className="rounded px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
                >
                  {n.l}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

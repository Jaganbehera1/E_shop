import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Boxes, ShoppingBag, Tags, FolderKanban, CalendarDays, Newspaper, Ticket, Users, Image, ArrowLeft, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useState } from 'react';

const NAV = [
  { to: '/admin', l: 'Dashboard', I: LayoutDashboard, end: true },
  { to: '/admin/products', l: 'Products', I: Boxes },
  { to: '/admin/orders', l: 'Orders', I: ShoppingBag },
  { to: '/admin/categories', l: 'Categories', I: Tags },
  { to: '/admin/projects', l: 'Projects', I: FolderKanban },
  { to: '/admin/appointments', l: 'Appointments', I: CalendarDays },
  { to: '/admin/blogs', l: 'Blog', I: Newspaper },
  { to: '/admin/coupons', l: 'Coupons', I: Ticket },
  { to: '/admin/customers', l: 'Customers', I: Users },
  { to: '/admin/banners', l: 'Banners', I: Image },
];

export function AdminLayout() {
  const { profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = (profile?.full_name ?? 'A')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Top bar */}
      <div className="surface border-b sticky top-0 z-30">
        <div className="cx flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white text-sm font-bold select-none">
              {initials}
            </span>
            <div>
              <h1 className="font-display text-base font-bold leading-tight">Admin Console</h1>
              {profile?.full_name && (
                <p className="text-xs text-[var(--muted)] leading-tight">{profile.full_name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
              <ArrowLeft className="h-4 w-4" /> Store
            </Link>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-[var(--soft)] hover:bg-[var(--surface2)] transition"
              >
                <span className="hidden sm:inline font-medium">{profile?.full_name ?? profile?.email ?? 'Admin'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1 w-48 surface border rounded-xl shadow-xl py-1">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-semibold truncate">{profile?.full_name}</p>
                      <p className="text-xs text-[var(--muted)] truncate">{profile?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">Admin</span>
                    </div>
                    <button
                      onClick={() => { setMenuOpen(false); signOut(); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-[var(--surface2)] transition"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="cx grid gap-6 py-6 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-20 md:self-start">
          <nav className="surface flex flex-col gap-1 p-2">
            {NAV.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'text-[var(--soft)] hover:bg-[var(--surface2)] hover:text-brand-600'
                  }`
                }
              >
                <n.I className="h-4 w-4" /> {n.l}
              </NavLink>
            ))}
          </nav>
        </aside>
        <Outlet />
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';
import { BIZ, WHATSAPP } from '../lib/supabase';

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-800 text-slate-300">
      {/* Trust badges */}
      <div className="border-b border-slate-700">
        <div className="cx grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
          {[
            { I: Truck, t: 'Free Shipping', d: 'On orders above ₹999' },
            { I: ShieldCheck, t: '6-Month Warranty', d: 'On all products' },
            { I: RefreshCw, t: '7-Day Returns', d: 'Easy returns' },
            { I: Headphones, t: '24/7 Support', d: 'WhatsApp & email' },
          ].map(({ I, t, d }, i) => (
            <div key={i} className="flex items-center gap-3">
              <I className="h-8 w-8 text-[#ff9f00]" />
              <div>
                <p className="text-sm font-semibold text-white">{t}</p>
                <p className="text-xs text-slate-400">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="cx grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Shop</h4>
          <ul className="space-y-2 text-sm">
            {[['All products', '/products'], ['Arduino boards', '/products?cat=arduino-boards'], ['ESP32 modules', '/products?cat=esp32'], ['School kits', '/products?cat=school-project-kits'], ['College kits', '/products?cat=college-project-kits']].map(([l, h]) => (
              <li key={l}><Link to={h} className="hover:text-[#ff9f00]">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Solutions</h4>
          <ul className="space-y-2 text-sm">
            {[['Project solutions', '/project-solutions'], ['Services', '/services'], ['Blog', '/blog'], ['Dashboard', '/dashboard'], ['Contact', '/contact']].map(([l, h]) => (
              <li key={l}><Link to={h} className="hover:text-[#ff9f00]">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#ff9f00]" />{BIZ.address}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#ff9f00]" />{BIZ.phone}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#ff9f00]" />{BIZ.email}</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">About</h4>
          <p className="text-sm text-slate-400">Electronics components, IoT & robotics solutions, school & college project kits, and custom development services.</p>
          <div className="mt-4 flex gap-3">
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#ff9f00]"><MessageCircle className="h-5 w-5" /></a>
            <a href={`mailto:${BIZ.email}`} className="text-slate-400 hover:text-[#ff9f00]"><Mail className="h-5 w-5" /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-700 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {BIZ.name}. Built for makers, students & engineers.
      </div>
    </footer>
  );
}

export function WAFab() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hello Jagan Electronics, I have a query.')}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}

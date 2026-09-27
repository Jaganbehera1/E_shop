import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Surface a readable error instead of a cryptic network failure
  const msg =
    'Missing Supabase environment variables.\n\n' +
    'Create a .env file in the project root with:\n' +
    '  VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=your-anon-key\n\n' +
    'You can find these in your Supabase project → Settings → API.';
  // In dev mode throw so the error overlay shows; in prod log and continue with dummy values
  if (import.meta.env.DEV) {
    throw new Error(msg);
  } else {
    console.error('[Jagan Electronics]', msg);
  }
}

export const supabase = createClient(
  SUPABASE_URL ?? '',
  SUPABASE_ANON_KEY ?? '',
  {
    auth: { persistSession: true, autoRefreshToken: true },
    global: {
      // Attach a reasonable timeout so fetch doesn't hang indefinitely
      fetch: (url, opts) => {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 10000);
        return fetch(url, { ...opts, signal: controller.signal }).finally(() =>
          clearTimeout(tid)
        );
      },
    },
  }
);

export const WHATSAPP = '+917978966065';
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
export const BIZ = {
  name: 'Jagan Electronics & Project Hub',
  email: 'jaganbehera63@gmail.com',
  phone: '+91 7978966065',
  address: 'Sikharchandi Vihar, Patia, Bhubaneswar, Odisha 751024',
  mapsQ: 'https://www.google.com/maps/search/?api=1&query=20.2961,85.8245',
};

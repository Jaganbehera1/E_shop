
/*
# Admin full-access RLS policies

Adds "admin can do everything" policies on all major tables so that a
signed-in user with role='admin' in public.profiles can perform all
CRUD operations without any row-level restriction.

Tables covered:
  profiles, categories, products, orders, order_items,
  addresses, project_requests, appointments, blogs, banners, coupons,
  support_tickets, cart, wishlist, reviews, inventory

Helper function:
  is_admin() — returns true when the calling user has role='admin'
*/

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- profiles
DROP POLICY IF EXISTS "admin_all_profiles" ON public.profiles;
CREATE POLICY "admin_all_profiles" ON public.profiles
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- categories
DROP POLICY IF EXISTS "admin_all_categories" ON public.categories;
CREATE POLICY "admin_all_categories" ON public.categories
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- products
DROP POLICY IF EXISTS "admin_all_products" ON public.products;
CREATE POLICY "admin_all_products" ON public.products
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- orders
DROP POLICY IF EXISTS "admin_all_orders" ON public.orders;
CREATE POLICY "admin_all_orders" ON public.orders
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- order_items
DROP POLICY IF EXISTS "admin_all_order_items" ON public.order_items;
CREATE POLICY "admin_all_order_items" ON public.order_items
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- addresses
DROP POLICY IF EXISTS "admin_all_addresses" ON public.addresses;
CREATE POLICY "admin_all_addresses" ON public.addresses
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- project_requests
DROP POLICY IF EXISTS "admin_all_project_requests" ON public.project_requests;
CREATE POLICY "admin_all_project_requests" ON public.project_requests
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- appointments
DROP POLICY IF EXISTS "admin_all_appointments" ON public.appointments;
CREATE POLICY "admin_all_appointments" ON public.appointments
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- blogs
DROP POLICY IF EXISTS "admin_all_blogs" ON public.blogs;
CREATE POLICY "admin_all_blogs" ON public.blogs
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- banners
DROP POLICY IF EXISTS "admin_all_banners" ON public.banners;
CREATE POLICY "admin_all_banners" ON public.banners
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- coupons
DROP POLICY IF EXISTS "admin_all_coupons" ON public.coupons;
CREATE POLICY "admin_all_coupons" ON public.coupons
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- support_tickets
DROP POLICY IF EXISTS "admin_all_support_tickets" ON public.support_tickets;
CREATE POLICY "admin_all_support_tickets" ON public.support_tickets
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- cart
DROP POLICY IF EXISTS "admin_all_cart" ON public.cart;
CREATE POLICY "admin_all_cart" ON public.cart
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- wishlist
DROP POLICY IF EXISTS "admin_all_wishlist" ON public.wishlist;
CREATE POLICY "admin_all_wishlist" ON public.wishlist
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- reviews
DROP POLICY IF EXISTS "admin_all_reviews" ON public.reviews;
CREATE POLICY "admin_all_reviews" ON public.reviews
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- inventory
DROP POLICY IF EXISTS "admin_all_inventory" ON public.inventory;
CREATE POLICY "admin_all_inventory" ON public.inventory
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

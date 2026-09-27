
/*
# Create product-images Storage bucket with RLS

1. Creates a public storage bucket called "product-images" so uploaded
   product photos are accessible via public URL.
2. RLS policies:
   - Admins (role='admin' in profiles) can INSERT, UPDATE, DELETE objects.
   - Everyone (anon + authenticated) can SELECT (read) objects since
     product images are public by nature.
*/

-- Create the bucket (idempotent via INSERT … ON CONFLICT DO NOTHING)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5 MB max per file
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml'];

-- Public read for everyone
DROP POLICY IF EXISTS "product_images_select" ON storage.objects;
CREATE POLICY "product_images_select"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-images');

-- Only admins can upload
DROP POLICY IF EXISTS "product_images_insert" ON storage.objects;
CREATE POLICY "product_images_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can replace/overwrite
DROP POLICY IF EXISTS "product_images_update" ON storage.objects;
CREATE POLICY "product_images_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can delete
DROP POLICY IF EXISTS "product_images_delete" ON storage.objects;
CREATE POLICY "product_images_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

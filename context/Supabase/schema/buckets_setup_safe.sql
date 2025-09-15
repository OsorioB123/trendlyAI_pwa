-- =====================================================
-- TrendlyAI — STORAGE BUCKETS (SAFE VARIANT)
-- Use this if you see: ERROR 42501 must be owner of table objects
-- This variant avoids ALTER TABLE and DROP POLICY on storage.objects
-- =====================================================

BEGIN;

-- Create buckets if they don't exist (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars','avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments','attachments', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('content','content', true)
ON CONFLICT (id) DO NOTHING;

-- NOTE: RLS on storage.objects is enabled by default in Supabase.
-- If creating policies below fails with ownership error, use the Supabase Dashboard
-- (Storage > Policies) to create the equivalent policies via UI.

-- Public read policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read avatars'
  ) THEN
    EXECUTE 'CREATE POLICY "Public read avatars" ON storage.objects '
         || 'FOR SELECT TO public USING (bucket_id = ''avatars'')';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read attachments'
  ) THEN
    EXECUTE 'CREATE POLICY "Public read attachments" ON storage.objects '
         || 'FOR SELECT TO public USING (bucket_id = ''attachments'')';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read content'
  ) THEN
    EXECUTE 'CREATE POLICY "Public read content" ON storage.objects '
         || 'FOR SELECT TO public USING (bucket_id = ''content'')';
  END IF;
END$$;

-- Authenticated write policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Auth write avatars'
  ) THEN
    EXECUTE 'CREATE POLICY "Auth write avatars" ON storage.objects '
         || 'FOR ALL TO authenticated '
         || 'USING (bucket_id = ''avatars'') '
         || 'WITH CHECK (bucket_id = ''avatars'')';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Auth write attachments'
  ) THEN
    EXECUTE 'CREATE POLICY "Auth write attachments" ON storage.objects '
         || 'FOR ALL TO authenticated '
         || 'USING (bucket_id = ''attachments'') '
         || 'WITH CHECK (bucket_id = ''attachments'')';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Auth write content'
  ) THEN
    EXECUTE 'CREATE POLICY "Auth write content" ON storage.objects '
         || 'FOR ALL TO authenticated '
         || 'USING (bucket_id = ''content'') '
         || 'WITH CHECK (bucket_id = ''content'')';
  END IF;
END$$;

COMMIT;

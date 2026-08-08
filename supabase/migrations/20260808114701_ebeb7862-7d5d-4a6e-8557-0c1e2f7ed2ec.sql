CREATE POLICY "Admins read media objects" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'media' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins upload media objects" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins update media objects" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins delete media objects" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_admin(auth.uid()));

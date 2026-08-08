-- public read policies no longer need the admin helper (admin FOR ALL policy already covers reads)
DROP POLICY "Public can view active categories" ON public.product_categories;
CREATE POLICY "Public can view active categories" ON public.product_categories
  FOR SELECT TO anon, authenticated USING (is_active);

DROP POLICY "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT TO anon, authenticated USING (is_active);

DROP POLICY "Public can view active projects" ON public.projects;
CREATE POLICY "Public can view active projects" ON public.projects
  FOR SELECT TO anon, authenticated USING (is_active);

DROP POLICY "Public can view active partners" ON public.partners;
CREATE POLICY "Public can view active partners" ON public.partners
  FOR SELECT TO anon, authenticated USING (is_active);

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_admin(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, service_role;

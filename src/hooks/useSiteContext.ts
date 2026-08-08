import { useLoaderData } from "@tanstack/react-router";
import type { SiteContext } from "@/lib/content-types";
import { SITE_CONTEXT_FALLBACK, waLink } from "@/lib/content-defaults";

/** Global brand + contact settings, loaded once by the root route. */
export function useSiteContext(): SiteContext {
  const data = useLoaderData({ from: "__root__" }) as SiteContext | undefined;
  return data ?? SITE_CONTEXT_FALLBACK;
}

/**
 * WhatsApp consultation link. Falls back to the contact page while no
 * number has been configured in the CMS yet.
 */
export function useWaLink(message?: string): string {
  const { contact } = useSiteContext();
  return waLink(contact.whatsapp_number, message) ?? "/contact";
}

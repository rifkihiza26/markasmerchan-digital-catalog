import { queryOptions } from "@tanstack/react-query";
import {
  getCatalog,
  getPartners,
  getProductBySlug,
  getProjects,
  getSiteContext,
} from "./content.functions";

const STALE = 30_000;

export const catalogQuery = queryOptions({
  queryKey: ["catalog"],
  queryFn: () => getCatalog(),
  staleTime: STALE,
});

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: () => getProjects(),
  staleTime: STALE,
});

export const partnersQuery = queryOptions({
  queryKey: ["partners"],
  queryFn: () => getPartners(),
  staleTime: STALE,
});

export const siteContextQuery = queryOptions({
  queryKey: ["site-context"],
  queryFn: () => getSiteContext(),
  staleTime: STALE,
});

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug({ data: { slug } }),
    staleTime: STALE,
  });

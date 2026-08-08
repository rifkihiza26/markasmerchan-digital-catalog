import { createServerFn } from "@tanstack/react-start";
import {
  loadCatalog,
  loadPartners,
  loadProduct,
  loadProjects,
  loadSiteContext,
} from "./content.server";

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => loadCatalog());

export const getProjects = createServerFn({ method: "GET" }).handler(async () => loadProjects());

export const getPartners = createServerFn({ method: "GET" }).handler(async () => loadPartners());

export const getSiteContext = createServerFn({ method: "GET" }).handler(async () =>
  loadSiteContext(),
);

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => ({ slug: String(input.slug) }))
  .handler(async ({ data }) => loadProduct(data.slug));

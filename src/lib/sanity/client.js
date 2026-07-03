import { createClient } from "@sanity/client";

export const sanityConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "o9lfog76",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || "2025-07-01",
  useCdn: true,
};

export const isSanityConfigured = Boolean(
  sanityConfig.projectId && sanityConfig.dataset,
);

export const sanityClient = isSanityConfigured
  ? createClient(sanityConfig)
  : null;

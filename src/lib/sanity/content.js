import { fallbackTributes, galleryItems, stories } from "@/data/siteContent.js";
import { fetchPublicSubmissions } from "@/lib/api.js";
import { sanityClient } from "@/lib/sanity/client.js";

const postsQuery = `
  *[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    title,
    excerpt,
    pullQuote,
    tag,
    isFeatured,
    "slug": slug.current
  }
`;

const galleryQuery = `
  *[_type == "galleryItem"] | order(coalesce(order, 999), _createdAt desc) {
    _id,
    title,
    caption,
    "image": image.asset->url
  }
`;

const tributeQuery = `
  *[_type == "tribute" && status == "approved"] | order(coalesce(approvedAt, _createdAt) desc) {
    _id,
    name,
    relationship,
    category,
    message,
    "imageUrl": coalesce(image.asset->url, externalImageUrl)
  }
`;

async function fetchSanityItems(query) {
  if (!sanityClient) {
    return [];
  }

  try {
    const items = await sanityClient.fetch(query);
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export async function fetchStoriesContent() {
  const cmsStories = await fetchSanityItems(postsQuery);
  return cmsStories.length ? cmsStories : stories;
}

export async function fetchGalleryContent() {
  const cmsGallery = await fetchSanityItems(galleryQuery);
  return cmsGallery.length ? cmsGallery : galleryItems;
}

export async function fetchApprovedTributesContent() {
  const cmsTributes = await fetchSanityItems(tributeQuery);
  if (cmsTributes.length) {
    return cmsTributes;
  }

  try {
    const payload = await fetchPublicSubmissions();
    if (payload.submissions?.length) {
      return payload.submissions;
    }
  } catch {
    // Keep the site working without a live API or Sanity config.
  }

  return fallbackTributes;
}

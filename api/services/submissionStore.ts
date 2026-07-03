import { createClient } from "@sanity/client";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type SubmissionRecord = {
  id: string;
  name: string;
  relationship: string;
  category: string;
  message: string;
  imageUrl: string;
  imageName: string;
  status: SubmissionStatus;
  createdAt: string;
};

type SubmissionImageInput = {
  buffer: Buffer;
  mimeType: string;
  filename: string;
};

function getSanityConfig() {
  return {
    projectId: process.env.SANITY_PROJECT_ID || "o9lfog76",
    dataset: process.env.SANITY_DATASET || "production",
    apiVersion: process.env.SANITY_API_VERSION || "2025-07-01",
    token: process.env.SANITY_AUTH_TOKEN || "",
  };
}

function getSanityClient() {
  const { projectId, dataset, apiVersion, token } = getSanityConfig();

  if (!projectId || !dataset || !token) {
    throw new Error(
      "Tribute submissions are not configured yet. Add a valid SANITY_AUTH_TOKEN in the root .env file and restart the API server.",
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}

function mapTributeDocument(entry: {
  _id: string;
  name?: string;
  relationship?: string;
  category?: string;
  message?: string;
  imageName?: string;
  status?: SubmissionStatus;
  createdAt?: string;
  imageUrl?: string;
}): SubmissionRecord {
  return {
    id: entry._id,
    name: entry.name || "Guest",
    relationship: entry.relationship || "Guest",
    category: entry.category || "Goodwill",
    message: entry.message || "",
    imageUrl: entry.imageUrl || "",
    imageName: entry.imageName || "",
    status: entry.status || "pending",
    createdAt: entry.createdAt || new Date().toISOString(),
  };
}

export async function createSubmission(
  input: Omit<SubmissionRecord, "id" | "status" | "createdAt">,
  image?: SubmissionImageInput,
): Promise<SubmissionRecord> {
  const client = getSanityClient();
  const createdAt = new Date().toISOString();
  let imageField = undefined;

  if (image) {
    const asset = await client.assets.upload("image", image.buffer, {
      contentType: image.mimeType,
      filename: image.filename,
    });

    imageField = {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    };
  }

  const created = await client.create({
    _type: "tribute",
    name: input.name,
    relationship: input.relationship,
    category: input.category,
    message: input.message,
    imageName: input.imageName || "",
    createdAt,
    status: "pending",
    image: imageField,
  });

  return mapTributeDocument({
    _id: created._id,
    ...input,
    status: "pending",
    createdAt,
    imageUrl: "",
  });
}

export async function readSubmissions(): Promise<SubmissionRecord[]> {
  const client = getSanityClient();
  const entries = await client.fetch(
    `*[_type == "tribute"] | order(coalesce(createdAt, _createdAt) desc) {
      _id,
      name,
      relationship,
      category,
      message,
      imageName,
      status,
      createdAt,
      "imageUrl": coalesce(image.asset->url, externalImageUrl)
    }`,
  );

  return Array.isArray(entries) ? entries.map(mapTributeDocument) : [];
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
): Promise<SubmissionRecord | null> {
  const client = getSanityClient();

  try {
    await client
      .patch(id)
      .set({
        status,
        approvedAt: status === "approved" ? new Date().toISOString() : null,
      })
      .commit();
  } catch {
    return null;
  }

  const updated = await client.fetch(
    `*[_id == $id][0]{
      _id,
      name,
      relationship,
      category,
      message,
      imageName,
      status,
      createdAt,
      "imageUrl": coalesce(image.asset->url, externalImageUrl)
    }`,
    { id },
  );

  return updated ? mapTributeDocument(updated) : null;
}

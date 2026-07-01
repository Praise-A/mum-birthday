import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const submissionsFilePath = path.join(__dirname, "..", "data", "submissions.json");

async function ensureStore() {
  await fs.mkdir(path.dirname(submissionsFilePath), { recursive: true });

  try {
    await fs.access(submissionsFilePath);
  } catch {
    await fs.writeFile(submissionsFilePath, "[]", "utf8");
  }
}

export async function readSubmissions(): Promise<SubmissionRecord[]> {
  await ensureStore();
  const raw = await fs.readFile(submissionsFilePath, "utf8");
  const parsed = JSON.parse(raw || "[]") as SubmissionRecord[];

  return parsed.sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export async function writeSubmissions(submissions: SubmissionRecord[]): Promise<void> {
  await ensureStore();
  await fs.writeFile(submissionsFilePath, JSON.stringify(submissions, null, 2), "utf8");
}

export async function createSubmission(
  input: Omit<SubmissionRecord, "id" | "status" | "createdAt">,
): Promise<SubmissionRecord> {
  const submissions = await readSubmissions();
  const submission: SubmissionRecord = {
    ...input,
    id: `sub-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  submissions.unshift(submission);
  await writeSubmissions(submissions);
  return submission;
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
): Promise<SubmissionRecord | null> {
  const submissions = await readSubmissions();
  const submission = submissions.find((entry) => entry.id === id);

  if (!submission) {
    return null;
  }

  submission.status = status;
  await writeSubmissions(submissions);
  return submission;
}

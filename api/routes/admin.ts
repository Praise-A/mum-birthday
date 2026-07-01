import express, { type Request, type Response } from "express";

import {
  readSubmissions,
  updateSubmissionStatus,
} from "../services/submissionStore.js";

const router = express.Router();

function isAuthorised(req: Request) {
  const adminKey = process.env.ADMIN_KEY || "mum50-admin-peace";
  return req.header("x-admin-key") === adminKey;
}

router.use((req: Request, res: Response, next) => {
  if (!isAuthorised(req)) {
    res.status(401).json({ success: false, error: "Invalid admin key." });
    return;
  }

  next();
});

router.get("/submissions", async (req: Request, res: Response) => {
  const status = String(req.query.status || "all");
  const submissions = await readSubmissions();
  const filtered =
    status === "all"
      ? submissions
      : submissions.filter((entry) => entry.status === status);

  res.json({
    submissions: filtered,
    counts: {
      pending: submissions.filter((entry) => entry.status === "pending").length,
      approved: submissions.filter((entry) => entry.status === "approved")
        .length,
      rejected: submissions.filter((entry) => entry.status === "rejected")
        .length,
    },
  });
});

router.patch("/submissions/:id", async (req: Request, res: Response) => {
  const status = String(req.body.status || "");

  if (!["approved", "rejected", "pending"].includes(status)) {
    res.status(400).json({ success: false, error: "Invalid status." });
    return;
  }

  const updated = await updateSubmissionStatus(
    req.params.id,
    status as "approved" | "rejected" | "pending",
  );

  if (!updated) {
    res.status(404).json({ success: false, error: "Submission not found." });
    return;
  }

  res.json({ success: true, submission: updated });
});

export default router;

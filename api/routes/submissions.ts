import express, { type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import {
  createSubmission,
  readSubmissions,
} from "../services/submissionStore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (_req, file, callback) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-");
    callback(null, `${Date.now()}-${cleanName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
      return;
    }

    callback(new Error("Only image uploads are allowed."));
  },
});

const router = express.Router();

router.get("/public", async (_req: Request, res: Response) => {
  const submissions = await readSubmissions();
  const approved = submissions.filter((entry) => entry.status === "approved");

  res.json({
    submissions: approved,
    gallery: approved.filter((entry) => entry.imageUrl),
    counts: {
      approved: approved.length,
      withPhotos: approved.filter((entry) => entry.imageUrl).length,
    },
  });
});

router.post("/", upload.single("photo"), async (req: Request, res: Response) => {
  const name = String(req.body.name || "").trim();
  const relationship = String(req.body.relationship || "Guest").trim();
  const category = String(req.body.category || "Goodwill").trim();
  const message = String(req.body.message || "").trim();
  const file = (
    req as Request & {
      file?: {
        originalname: string;
        filename: string;
      };
    }
  ).file;

  if (!name) {
    res.status(400).json({ success: false, error: "Name is required." });
    return;
  }

  if (!message && !file) {
    res.status(400).json({
      success: false,
      error: "Please include a message, a photo, or both.",
    });
    return;
  }

  const submission = await createSubmission({
    name,
    relationship,
    category,
    message,
    imageName: file?.originalname || "",
    imageUrl: file ? `/uploads/${file.filename}` : "",
  });

  res.status(201).json({
    success: true,
    message: "Your tribute has been received and is awaiting approval.",
    submission,
  });
});

export default router;

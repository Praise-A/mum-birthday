import express, { type Request, type Response } from "express";
import multer from "multer";

import {
  createSubmission,
  readSubmissions,
} from "../services/submissionStore.js";

const upload = multer({
  storage: multer.memoryStorage(),
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

function handleRouteError(error: unknown, res: Response) {
  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong while processing the tribute.";

  res.status(500).json({
    success: false,
    error: message,
  });
}

router.get("/public", async (_req: Request, res: Response) => {
  try {
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
  } catch (error) {
    handleRouteError(error, res);
  }
});

router.post(
  "/",
  upload.single("photo"),
  async (req: Request, res: Response) => {
    try {
      const name = String(req.body.name || "").trim();
      const relationship = String(req.body.relationship || "Guest").trim();
      const category = String(req.body.category || "Goodwill").trim();
      const message = String(req.body.message || "").trim();
      const file = (
        req as Request & {
          file?: {
            originalname: string;
            mimetype: string;
            buffer: Buffer;
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

      const submission = await createSubmission(
        {
          name,
          relationship,
          category,
          message,
          imageName: file?.originalname || "",
          imageUrl: "",
        },
        file
          ? {
              buffer: file.buffer,
              mimeType: file.mimetype,
              filename: file.originalname,
            }
          : undefined,
      );

      res.status(201).json({
        success: true,
        message: "Your tribute has been received and is awaiting approval.",
        submission,
      });
    } catch (error) {
      handleRouteError(error, res);
    }
  },
);

export default router;

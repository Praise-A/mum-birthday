/**
 * This is a API server
 */

import cors from "cors";
import dotenv from "dotenv";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import submissionRoutes from "./routes/submissions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app: express.Application = express();
const uploadsDirectory = path.join(__dirname, "uploads");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(uploadsDirectory));

app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/admin", adminRoutes);

app.use(
  "/api/health",
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: "ok",
    });
  },
);

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: error.message || "Server internal error",
  });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "API not found",
  });
});

export default app;

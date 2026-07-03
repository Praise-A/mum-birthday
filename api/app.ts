/**
 * This is a API server
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

import cors from "cors";
import dotenv from "dotenv";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import submissionRoutes from "./routes/submissions.js";

dotenv.config();

const app: express.Application = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");
const indexFile = path.join(distDir, "index.html");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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

app.use("/api", (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "API not found",
  });
});

app.use(express.static(distDir));

app.get("*", (_req: Request, res: Response) => {
  res.sendFile(indexFile);
});

export default app;

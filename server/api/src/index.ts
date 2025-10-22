import express, { Request, Response } from "express";
import * as ort from "onnxruntime-node";
import dotenv from "dotenv";
import InferenceService from "./utils/inference";
import Database from "./utils/db";
import routes from "./routes/routes";
dotenv.config();

const app = express();
app.use(express.json());
const db = new Database();
const service = new InferenceService();
function generateFloat32Array(length: number) {
  return new Float32Array(Array.from({ length }, () => Math.random()));
}

app.use((req, res, next) => {
  req.db = db;
  req.service = service;
  next();
});

app.use(routes);
// app.get("/mock", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const embed = await db.getArticleEmbeddings([381, 382, 383, 389]);
//     const tmp = Array.from(embed.values());
//     const projected = await service.inferNews({
//       embeddings: tmp,
//       embeddingDims: [tmp.length, 768],
//     });
//     console.log(projected);
//     (res.status(200) as any).json({ a: tmp, b: tmp.length });
//   } catch (error: unknown) {
//     console.error("Error in /mock route:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error";
//     (res.status(500) as any).json({
//       error: "Internal server error",
//       details: errorMessage,
//     });
//   }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await service.initialize();
  await db.connect();
  console.log(`Server running on port ${PORT}`);
});

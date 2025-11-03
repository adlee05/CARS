import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import InferenceService from "./utils/inference";
import Database from "./utils/db";
import routes from "./routes/routes";
import User from "./types/user";
import { supabase } from "./utils/supabase";

dotenv.config();
const app = express();

declare module "express-serve-static-core" {
  interface Request {
    db: Database;
    service: InferenceService;
    user: User;
  }
}

const db = new Database();
const service = new InferenceService();
app.use((req: Request, res: Response, next: NextFunction) => {
  req.db = db;
  req.service = service;
  next();
});

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  if (req.path === "/login" || req.path === "/register") {
    return next();
  }
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.sendStatus(403);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.sendStatus(403);
  }
  req.user = data.user;
  next();
};

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  }),
);
app.use(verifyJWT);
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await service.initialize();
  await db.connect();
  console.log(`Server running on port ${PORT}`);
});

import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as ort from "onnxruntime-node";
import dotenv from "dotenv";
import cors from "cors";
import InferenceService from "./utils/inference";
import Database from "./utils/db";
import routes from "./routes/routes";
import User from "./types/user";
import { hashPassword } from "./utils/crypt";

dotenv.config();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*", // Allow all origins
    methods: "GET, POST, OPTIONS", // Allow necessary methods
    allowedHeaders: "Content-Type, Authorization", // Allow Content-Type and Authorization headers
  }),
);

declare module "express-serve-static-core" {
  interface Request {
    db: Database;
    service: InferenceService;
    user: User;
  }
}

const db = new Database();
const service = new InferenceService();
let users: User[] = [
  {
    id: 1,
    username: "john_doe",
    password: "$2b$10$eN8Cln1/2IWmreO6Egw4qO1Kf5nbapOS4fkH9fuB3f7fSPTELEv/W", // bcrypt hash of 'password123'
  },
];

function generateFloat32Array(length: number) {
  return new Float32Array(Array.from({ length }, () => Math.random()));
}

app.use((req: Request, res: Response, next: NextFunction) => {
  req.db = db;
  req.service = service;
  next();
});

// TODO: alpha version only, requires rewriting;
const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === "/login") {
    return next();
  }
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.sendStatus(403);
  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user as User;
    next();
  });
};
app.use(verifyJWT);
app.use(routes);

// TODO: alpha version only, requires rewriting;
app.post("/login", async (req: Request, res: Response) => {
  console.log("in login", req.body);
  const body = req.body;
  if (!body || !body.username || !body.password) {
    return res.status(400).send("Username and Password Required");
  }
  const user = users.find((u) => u.username === body.username);
  if (!user) return res.status(401).send("User not found");
  const isMatch = await bcrypt.compare(body.password, user?.password || "");
  console.log(await hashPassword(body.password));
  if (!isMatch) return res.status(401).send("Invalid password");
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET as string,
    { algorithm: "HS256", expiresIn: "48h" },
  );
  res.json({ token });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await service.initialize();
  await db.connect();
  console.log(`Server running on port ${PORT}`);
});

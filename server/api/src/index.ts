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
import { supabase } from "./utils/supabase";

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
  if (req.path === "/login" || req.path === "/register") {
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
  if (!body || !body.email || !body.password) {
    return res.status(400).send("Email and Password Required");
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    if (!data.session) {
      return res.status(401).json({ error: "Failed to create session" });
    }

    // Generate JWT for backward compatibility
    const token = jwt.sign(
      { id: data.user.id, email: data.user.email, username: data.user.email?.split('@')[0] },
      process.env.JWT_SECRET as string,
      { algorithm: "HS256", expiresIn: "48h" },
    );

    res.json({ token, user: data.user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/register", async (req: Request, res: Response) => {
  console.log("in register", req.body);
  const body = req.body;
  if (!body || !body.email || !body.password) {
    return res.status(400).send("Email and Password Required");
  }

  if (body.password.length < 6) {
    return res.status(400).send("Password must be at least 6 characters");
  }

  try {
    const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/email-confirmation`;
    
    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data.user) {
      return res.status(400).json({ error: "Failed to create user" });
    }

    // Check if email confirmation is required
    if (data.session) {
      // User is automatically logged in (no email confirmation required)
      const token = jwt.sign(
        { id: data.user.id, email: data.user.email, username: data.user.email?.split('@')[0] },
        process.env.JWT_SECRET as string,
        { algorithm: "HS256", expiresIn: "48h" },
      );
      return res.json({ token, user: data.user });
    } else {
      // Email confirmation required
      return res.json({ 
        user: data.user,
        requiresEmailConfirmation: true,
        message: "Please check your email to confirm your account." 
      });
    }
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await service.initialize();
  await db.connect();
  console.log(`Server running on port ${PORT}`);
});

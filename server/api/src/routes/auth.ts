import express, { Request, Response, NextFunction } from "express";
import { supabase } from "../utils/supabase";

const Login = async (req: Request, res: Response) => {
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

    res.json({ token: data.session.access_token, user: data.user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const Register = async (req: Request, res: Response) => {
  console.log("in register", req.body);
  const body = req.body;
  if (!body || !body.email || !body.password) {
    return res.status(400).send("Email and Password Required");
  }

  if (body.password.length < 6) {
    return res.status(400).send("Password must be at least 6 characters");
  }

  try {
    const redirectUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/auth/email-confirmation`;
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
    if (data.session) {
      await req.db.registerUser(
        data.user.id,
        data.user.email || "",
        "user",
        data.user.email?.split("@")[0] || "",
      );

      res.json({ token: data.session.access_token, user: data.user });
    } else {
      return res.json({
        user: data.user,
        requiresEmailConfirmation: true,
        message: "Please check your email to confirm your account.",
      });
    }
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { Login, Register };

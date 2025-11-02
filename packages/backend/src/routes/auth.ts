import { Router } from "express";
import { z } from "zod";

import { registerUser, loginUser } from "../services/authService";

const router = Router();

const registerSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

router.post("/register", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await registerUser(data.name, data.email, data.password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data.email, data.password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

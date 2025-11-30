import { Router } from "express";
import z from "zod";

import {
  requireAuth,
  requireRole,
  requireRoleOrSelf,
} from "../middleware/auth";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
} from "../services/userServices";

const router = Router();

const userSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  password: z.string().min(6).optional(),
});

// Create user
router.post("/", requireRole("admin"), async (req, res) => {
  try {
    const data = userSchema.parse(req.body);

    const user = await createUser(data);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users
router.get("/", requireRole("admin"), async (req, res) => {
  const allUsers = await getUsers().catch((err) => {
    console.error(err);
    res.status(500);
  });

  res.json(allUsers);
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: (req as any).user });
});

// Get user by ID
router.get("/:id", requireRole("admin"), async (req, res) => {
  const user = await getUser(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.put("/:id", requireRoleOrSelf("admin"), async (req, res) => {
  try {
    const data = updateUserSchema.parse(req.body);

    const user = await updateUser({
      id: req.params.id,
      ...data,
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

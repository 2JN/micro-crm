import { Router } from "express";

import { createUser, getUser, getUsers, updateUser } from "../services/userServices";

const router = Router();

// Create user
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const user = await createUser({name, email, password});
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "User creation failed" });
  }
});

// Get all users
router.get("/", async (req, res) => {
  const allUsers = await getUsers().catch((err) => {
    console.error(err)
    res.status(500)
  })

  res.json(allUsers);
});

// Get user by ID
router.get("/:id", async (req, res) => {
  const user = await getUser(req.params.id)
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.put("/:id", async(req, res) => {
  const user = await updateUser({
    id: req.params.id,
    ...req.body
  })

  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user)
})

export default router;

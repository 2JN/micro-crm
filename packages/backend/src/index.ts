import "dotenv/config";
import express from "express";
import cors from "cors";

import usersRouter from "./routes/users";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);

// test route
app.get("/", (req, res) => {
  res.json({ message: "Micro CRM backend running 🚀" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

export default app;

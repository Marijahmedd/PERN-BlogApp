// src/app.ts
import express from "express";
import blogRouter from "./routes/blog.routes";
import { authRouter } from "./routes/auth.routes";
import { RequireAuth } from "./middleware/auth";
import { RequestHandler } from "express";
const app = express();

app.use(express.json()); // middleware to parse JSON

// mount the blog router
app.use("/api/blog", RequireAuth, blogRouter);
app.use("/api/auth", authRouter);
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
export default app;

// src/routes/blog.routes.ts
import express from "express";
import { RequestHandler } from "express"; // <-- Import RequestHandler
import {
  createBlog,
  deleteBlog,
  EditBlog,
  getBlog,
  getBlogDetails,
} from "../controller/blog.controller";

const blogRouter = express.Router();
export default blogRouter;

blogRouter.post("/", createBlog as unknown as RequestHandler);

blogRouter.get("/", getBlog);

blogRouter.get("/:id", getBlogDetails);

blogRouter.put("/", EditBlog);

blogRouter.delete("/:id", deleteBlog as unknown as RequestHandler);

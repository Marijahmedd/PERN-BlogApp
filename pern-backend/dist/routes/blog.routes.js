"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/blog.routes.ts
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("../controller/blog.controller");
const blogRouter = express_1.default.Router();
exports.default = blogRouter;
blogRouter.post("/", blog_controller_1.createBlog);
blogRouter.get("/", blog_controller_1.getBlog);
blogRouter.get("/:id", blog_controller_1.getBlogDetails);
blogRouter.put("/", blog_controller_1.EditBlog);
blogRouter.delete("/:id", blog_controller_1.deleteBlog);

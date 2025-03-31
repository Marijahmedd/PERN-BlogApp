// src/controller/blog.controller.ts
import { Request, Response } from "express";
import { prisma } from "../lib/dbConnect";

import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { AuthenticatedRequest } from "../middleware/auth";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createBlog(req: AuthenticatedRequest, res: Response) {
  try {
    const { caption, url, publicId } = req.body;
    console.log(
      `Creating blog for user ${req.user.email} (ID: ${req.user.id})`
    );
    const newBlog = await prisma.blog.create({
      data: {
        caption,
        url,
        publicId,
        authorID: req.user.id,
      },
    });

    res.status(201).json(newBlog);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

export async function getBlog(req: Request, res: Response) {
  try {
    const Blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            email: true,
          },
        },
      },
    });

    res.status(201).json(Blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

export async function getBlogDetails(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const blogDetails = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!blogDetails) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }
    res.status(200).json(blogDetails);
  } catch (error) {
    console.log("error getting blog details", error);
    res.status(500).json({ error: "something went wrong" });
  }
}

export async function EditBlog(req: Request, res: Response) {
  try {
    const { caption, url, publicId, editId } = req.body;

    const oldData = await prisma.blog.findUnique({
      where: {
        id: editId,
      },
    });

    if (!oldData) {
      res.status(404).json({ error: "No blog found of this ID" });
      return;
    }
    let oldPublicId = oldData.publicId;
    console.log(publicId);
    const newBlog = await prisma.blog.update({
      where: {
        id: editId,
      },
      data: {
        caption,
        url,
        publicId,
      },
    });
    let deleteOldImage = null;

    if (oldPublicId !== publicId) {
      try {
        deleteOldImage = await cloudinary.uploader.destroy(oldPublicId, {
          invalidate: true,
        });
      } catch (CloudError) {
        console.log("cloud error ", CloudError);
      }
    }
    res.status(200).json({
      message: "old image deleted and blog updated ",
      newBlog,
      deleteOldImage,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

////

export async function deleteBlog(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const loggedInUser = req.user.id;

    const oldData = await prisma.blog.findUnique({
      where: {
        id: id,
        authorID: loggedInUser,
      },
    });
    if (!oldData) {
      res.status(403).json({ error: "You donot own this blog" });
      return;
    }
    const cloudinaryPublicId = oldData.publicId;
    const blogDelete = await prisma.blog.delete({
      where: {
        id,
        authorID: loggedInUser,
      },
    });
    let deleteOldImage = null;
    try {
      deleteOldImage = await cloudinary.uploader.destroy(cloudinaryPublicId, {
        invalidate: true,
      });
    } catch (CloudError) {
      console.log("cloud error ", CloudError);
    }

    res.status(200).json({
      message: "Blog and image from cloudinary deleted",
      blogDelete,
      deleteOldImage,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "internal server error ", error });
    console.log("internal server error", error);
  }
}

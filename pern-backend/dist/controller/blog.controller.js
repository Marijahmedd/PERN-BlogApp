"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlog = createBlog;
exports.getBlog = getBlog;
exports.getBlogDetails = getBlogDetails;
exports.EditBlog = EditBlog;
exports.deleteBlog = deleteBlog;
const dbConnect_1 = require("../lib/dbConnect");
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = require("cloudinary");
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
function createBlog(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { caption, url, publicId } = req.body;
            console.log(`Creating blog for user ${req.user.email} (ID: ${req.user.id})`);
            const newBlog = yield dbConnect_1.prisma.blog.create({
                data: {
                    caption,
                    url,
                    publicId,
                    authorID: req.user.id,
                },
            });
            res.status(201).json(newBlog);
            return;
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Something went wrong" });
        }
    });
}
function getBlog(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Blogs = yield dbConnect_1.prisma.blog.findMany({
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Something went wrong" });
        }
    });
}
function getBlogDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const blogDetails = yield dbConnect_1.prisma.blog.findUnique({
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
        }
        catch (error) {
            console.log("error getting blog details", error);
            res.status(500).json({ error: "something went wrong" });
        }
    });
}
function EditBlog(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { caption, url, publicId, editId } = req.body;
            const oldData = yield dbConnect_1.prisma.blog.findUnique({
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
            const newBlog = yield dbConnect_1.prisma.blog.update({
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
                    deleteOldImage = yield cloudinary_1.v2.uploader.destroy(oldPublicId, {
                        invalidate: true,
                    });
                }
                catch (CloudError) {
                    console.log("cloud error ", CloudError);
                }
            }
            res.status(200).json({
                message: "old image deleted and blog updated ",
                newBlog,
                deleteOldImage,
            });
            return;
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Something went wrong" });
        }
    });
}
////
function deleteBlog(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const loggedInUser = req.user.id;
            const oldData = yield dbConnect_1.prisma.blog.findUnique({
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
            const blogDelete = yield dbConnect_1.prisma.blog.delete({
                where: {
                    id,
                    authorID: loggedInUser,
                },
            });
            let deleteOldImage = null;
            try {
                deleteOldImage = yield cloudinary_1.v2.uploader.destroy(cloudinaryPublicId, {
                    invalidate: true,
                });
            }
            catch (CloudError) {
                console.log("cloud error ", CloudError);
            }
            res.status(200).json({
                message: "Blog and image from cloudinary deleted",
                blogDelete,
                deleteOldImage,
            });
            return;
        }
        catch (error) {
            res.status(500).json({ message: "internal server error ", error });
            console.log("internal server error", error);
        }
    });
}

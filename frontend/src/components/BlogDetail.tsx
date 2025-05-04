// src/pages/BlogDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useStore } from "../store/myStore";

type Blog = {
  id: string;
  caption: string;
  url: string;
  authorID: string;
  createdAt: string;
  author: {
    email: string;
  };
};

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const currentUserId = useStore((state) => state.user?.id);
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blog/${id}`);
        setBlog(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await axios.delete(`/api/blog/${id}`);
      navigate("/blog");
    } catch (err) {
      console.error("Delete failed", err);
      setDeleting(false);
    }
  };

  const ownsBlog = !!blog && !!currentUserId && currentUserId === blog.authorID;

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center text-gray-500">
        Loading blog...
      </div>
    );
  }

  if (!blog) {
    return <div className="p-4 text-red-500">Blog not found.</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto flex flex-col gap-4">
      {/* Blog Image */}
      <div className="w-full aspect-video rounded overflow-hidden bg-gray-700">
        {" "}
        {/* Use aspect-video for consistent ratio */}
        <img
          src={blog.url}
          alt={blog.caption}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Blog Caption */}
      <h2 className="text-xl font-semibold text-white">{blog.caption}</h2>

      {/* Author and Date Info - Grouped for better structure */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-400">
        {/* --- Beautified Author --- */}
        <p>
          By:{" "}
          <span className="font-medium text-gray-300">
            {blog.author?.email || "Unknown Author"}
          </span>
        </p>
        {/* --- End Beautified Author --- */}

        <p className="mt-1 sm:mt-0">
          {new Date(blog.createdAt).toLocaleString()}
        </p>
      </div>

      {ownsBlog && (
        <div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => navigate(`/edit/${blog.id}`)} // Assuming an edit route
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-150 ease-in-out"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-150 ease-in-out ${
                deleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={deleting}
            >
              {deleting ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

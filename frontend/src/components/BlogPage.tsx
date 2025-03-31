import axios from "../api/axios";
import { useEffect, useState } from "react";
import ListBlogs from "./listBlogs";
import { Link } from "react-router";
import { useStore } from "../store/myStore";
const BlogPage = () => {
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = useStore((state) => state.user?.email);
  useEffect(() => {
    async function GetBlogs() {
      try {
        const result = await axios.get(`${import.meta.env.VITE_BASEURL}/blog`, {
          withCredentials: true, // ✅ important
        });
        setBlogData(result.data);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    }
    GetBlogs();
  }, []);
  if (loading) {
    return <div>loading...</div>;
  }
  {
    console.log(blogData);
  }

  return (
    <>
      <div className="flex justify-between flex-row p-4 mx-5">
        <h1>myBlog</h1>
        <h1>you are logged in as {userEmail}</h1>
        <Link to="/blog/create">
          <button className="border-2 px-2 py-1 hover:bg-blue-900 bg-gray-900 rounded transition-colors">
            Create new Blog
          </button>
        </Link>
      </div>
      <div className="flex justify-end w-full">
        <button className="flex  px-6 py-1 mr-7 rounded-md border-2 items-end bg-gray-900 hover:bg-blue-900 ">
          Filter my blogs
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
          Blogs
        </h2>
        {blogData.length <= 0 ? (
          <h1 className="text-2xl flex justify-center items-center py-30">
            No Blogs!{" "}
          </h1>
        ) : (
          <ListBlogs blogs={blogData} />
        )}
      </div>
    </>
  );
};

export default BlogPage;

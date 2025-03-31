import { Link } from "react-router";

type BlogProps = {
  id: string;
  caption: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  author: {
    email: string;
  };
};

type listBlogProps = {
  blogs: BlogProps[];
};

const ListBlogs = ({ blogs }: listBlogProps) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link to={`/blog/${blog.id}`} key={blog.id}>
            <div
              key={blog.id}
              className="bg-gray shadow-md rounded-2xl p-4 border border-gray-200 hover:bg-blue-900 transition"
            >
              <img
                loading="lazy"
                src={blog.url}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="text-lg font-semibold mb-2 truncate">
                {blog.caption}
              </h3>
              <p className="text-sm text-gray-200">
                Created by: {blog.author.email}
              </p>
              <p className="text-sm text-gray-200">
                Created at: {new Date(blog.createdAt).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ListBlogs;

import BlogForm from "./BlogForm";

const CreateBlog = () => {
  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8 flex items-center justify-center overflow-x-hidden">
      <div className="w-full max-w-md bg-gray-700 rounded-md p-5">
        <h1 className="text-white text-xl font-semibold mb-4 text-center">
          Create New Blog
        </h1>
        <BlogForm />
      </div>
    </div>
  );
};

export default CreateBlog;

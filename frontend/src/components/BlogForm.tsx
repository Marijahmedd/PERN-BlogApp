import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

type Inputs = {
  caption: string;
  image: FileList; // FileList for file input
};

export default function BlogForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const file = data.image[0];
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", file);
      cloudinaryData.append("upload_preset", "Blog_image_preset");

      const fetchedData = await fetch(
        `${import.meta.env.VITE_CLOUDINARY_URL}/${
          import.meta.env.VITE_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: cloudinaryData,
        }
      );
      const decoded = await fetchedData.json();

      const imageResponse = {
        data: decoded,
      };

      console.log(imageResponse.data.secure_url);
      console.log(imageResponse.data.public_id);
      await axios.post(`/api/blog`, {
        caption: data.caption,
        url: imageResponse.data.secure_url,
        publicId: imageResponse.data.public_id,
      });
      navigate("/blog");
      reset();
      setImagePreview(null);
    } catch (error) {
      console.log("error submitting the data");
    }
  };

  const imageChange = watch("image");

  useEffect(() => {
    const imageFile = imageChange?.[0];
    if (imageFile) {
      setImagePreview(URL.createObjectURL(imageFile));
    }
  }, [imageChange]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full"
    >
      <label className="w-full h-48 border border-dashed border-gray-400 flex items-center justify-center rounded cursor-pointer overflow-hidden relative bg-gray-700">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-gray-300">Upload an image</span>
        )}
        <input
          type="file"
          accept="image/*"
          {...register("image", { required: true })}
          //   onChange={handleImageChange}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
      </label>
      {errors.image && <span className="text-red-500">Image is required</span>}

      {/* Caption Input */}
      <input
        placeholder="Enter caption"
        {...register("caption", { required: true })}
        className="border p-2 rounded"
      />
      {errors.caption && (
        <span className="text-red-500">Caption is required</span>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Uploading...
          </div>
        ) : (
          "Submit"
        )}
      </button>

      {/* Optional: Full-screen overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center rounded transition-all duration-300">
          <div className="flex items-center gap-3 text-white text-sm font-medium bg-black/60 px-4 py-2 rounded shadow-md">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Uploading...
          </div>
        </div>
      )}
    </form>
  );
}

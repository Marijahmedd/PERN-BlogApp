import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
type Inputs = {
  caption: string;
  image: FileList; // FileList for file input
};

interface ImageData {
  current_url: string;
  current_public_id: string;
}

export default function EditForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const [oldCaption, setOldCaption] = useState<string>("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentId, setID] = useState<string>("");

  const [imageData, setImageData] = useState<ImageData>({
    current_url: "",
    current_public_id: "",
  });
  const { id } = useParams();
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASEURL}/blog/${id}`
        );
        if (!res) {
          setNotFound(true);
          setLoading(false);
        }

        reset({ caption: res.data.caption });

        setImageData({
          current_public_id: res.data.publicId,
          current_url: res.data.url,
        });

        setImagePreview(res.data.url);

        // setOldCaption(res.data.caption);
        setID(res.data.id);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setNotFound(true);
      }
    };
    fetchBlog();
  }, [id]);
  let newImageUrl = imageData.current_url;
  let newPublicId = imageData.current_public_id;
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (imageChange) {
        const file = data.image[0];
        const cloudinaryData = new FormData();
        cloudinaryData.append("file", file);
        cloudinaryData.append("upload_preset", "Blog_image_preset");

        const imageResponse = await axios.post(
          `${import.meta.env.VITE_CLOUDINARY_URL}/${
            import.meta.env.VITE_CLOUD_NAME
          }/image/upload`,
          cloudinaryData
        );
        newImageUrl = imageResponse.data.secure_url;
        newPublicId = imageResponse.data.public_id;
        setImagePreview(newImageUrl);
        setImageData({
          current_public_id: imageResponse.data.public_id,
          current_url: imageResponse.data.secure_url,
        });
      }

      console.log(imageData.current_public_id);
      console.log(imageData.current_url);

      await axios.put(`${import.meta.env.VITE_BASEURL}/blog`, {
        caption: data.caption,
        url: newImageUrl,
        publicId: newPublicId,
        editId: currentId,
      });

      reset();
      setImagePreview(null);
      navigate(`/blog/${currentId}`);
    } catch (error) {
      console.log("error editing the data");
    }
  };

  const imageChange = watch("image");
  console.log("image change status: ", imageChange);
  useEffect(() => {
    const imageFile = imageChange?.[0];
    if (imageFile) {
      setImagePreview(URL.createObjectURL(imageFile));
    }
  }, [imageChange]);

  if (!loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <span className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></span>
        Loading blog...
      </div>
    );
  }
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <h2 className="text-2xl font-semibold mb-2">Blog Not Found</h2>
        <p className="text-gray-400">
          The blog you’re looking for doesn’t exist or was deleted.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-80"
    >
      <label className="w-full h-48 border border-dashed border-gray-400 flex items-center justify-center rounded cursor-pointer overflow-hidden relative bg-gray-700">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-gray-300">
            <span className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></span>
            <span>Loading...</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          {...register("image", { required: imagePreview ? false : true })}
          //   onChange={handleImageChange}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
      </label>
      {errors.image && <span className="text-red-500">Image is required</span>}

      {/* Caption Input */}
      <input
        defaultValue="loading...."
        placeholder=""
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

import axios from "../api/axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Inputs = {
  email: string;
};

export default function ForgotPassword() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  async function onSubmit(data: Inputs) {
    try {
      const response = await axios.post(`/api/auth/password-reset`, data);

      setIsSuccess(true);
      setMessage(response.data.message);
    } catch (error: any) {
      setIsSuccess(false);
      setMessage(error.response?.data?.error || "Something went wrong");
    }
  }

  // Automatically clear message after 4 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Reset your account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="mt-1 block text-gray-900 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {message && (
            <div
              className={`text-sm font-medium mt-1 ${
                isSuccess ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }
            `}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Sending Email...</span>
            ) : (
              "Send password reset mail"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

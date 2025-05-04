import axios from "../api/axios";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

type Inputs = {
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setMessage("No token provided.");
      return;
    }

    axios
      .get(`/api/auth/validate-token?token=${token}`)
      .then(() => {
        setTokenValid(true);
      })
      .catch((err) => {
        setTokenValid(false);
        setMessage(err.response?.data?.error || "Invalid or expired token");
      });
  }, [token]);

  async function onSubmit(data: Inputs) {
    try {
      const response = await axios.post(`/api/auth/set-password`, {
        token,
        password: data.password,
        passwordAgain: data.confirmPassword,
      });
      setMessage(response.data.message);
      setTimeout(() => navigate("/register"), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Something went wrong");
    }
  }

  if (tokenValid === null) {
    return <div className="text-center mt-10">Validating token...</div>;
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 font-semibold text-lg">{message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Set a new password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900">
              New Password
            </label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="mt-1 block w-full border px-4 py-2 rounded-lg text-gray-900"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                validate: (val) =>
                  val === watch("password") || "Passwords do not match",
              })}
              className="mt-1 block w-full border px-4 py-2 rounded-lg text-gray-900"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {message && (
            <div className="text-center text-sm font-medium text-blue-600">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded-lg transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isSubmitting ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

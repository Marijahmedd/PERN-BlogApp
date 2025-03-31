import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { useStore } from "../store/myStore";

type FormData = {
  email: string;
  password: string;
};

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const login = useStore((state) => state.login);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setStatus("idle");
    setMessage("");

    const endpoint = isLogin
      ? `${import.meta.env.VITE_BASEURL}/auth/login`
      : `${import.meta.env.VITE_BASEURL}/auth/register`;

    if (isLogin) {
      try {
        await login(data.email, data.password);
        const storedToken = useStore.getState().accessToken;

        if (!storedToken) {
          throw new Error("No token found after login.");
        }

        setStatus("success");
        setMessage("Successfully logged in");
        navigate("/");
        reset();
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "Something went wrong");
      }
    } else {
      try {
        const response = await axios.post(endpoint, data, {
          withCredentials: true,
        });
        setStatus("success");
        setMessage(response.data.message);
        reset();
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.error || "Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isLogin ? "Login to your account" : "Create a new account"}
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

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="mt-1 text-gray-900 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-semibold py-2 px-4 rounded-lg transition 
    ${
      isSubmitting
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-500 hover:bg-blue-600 text-white"
    }`}
          >
            {isSubmitting
              ? isLogin
                ? "Logging in..."
                : "Registering..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        {status === "success" && (
          <div className="mt-4 text-green-600 font-medium text-center">
            {message}
          </div>
        )}
        {status === "error" && (
          <div className="mt-4 text-red-600 font-medium text-center">
            {message}
          </div>
        )}
        {isLogin && (
          <Link to="/forgot-password">
            <div className="flex justify-center mt-6">
              <button className="text-sm text-gray-700 hover:underline">
                Forgot Password?
              </button>
            </div>
          </Link>
        )}

        <div className="mt-6 text-sm text-center text-gray-700">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            disabled={isSubmitting}
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
              setStatus("idle");
              reset();
            }}
            className="text-blue-500 hover:underline font-medium {}"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

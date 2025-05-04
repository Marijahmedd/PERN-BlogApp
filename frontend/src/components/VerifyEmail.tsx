import axios from "../api/axios";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No token provided.");
      return;
    }

    const verify = async () => {
      try {
        const response = await axios.post(`/api/auth/verify-email`, {
          token,
        });

        setStatus("success");
        setMessage(response.data.message);
        setEmail(response.data.userVerified.email);
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.error || "Verification failed.");
      }
    };

    verify();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-medium text-gray-700 animate-pulse">
          Verifying email...
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full text-center">
          <h1 className="text-2xl font-semibold text-indigo-600 mb-2">
            {message}
          </h1>
          <p className="text-gray-700">
            Your email{" "}
            <span className="font-medium text-indigo-500">{email}</span> has
            been verified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-2">
          Verification Failed
        </h1>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;

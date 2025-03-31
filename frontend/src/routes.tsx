import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import BlogPage from "./components/BlogPage.tsx";
import CreateBlog from "./components/CreateBlog.tsx";
import BlogDetail from "./components/BlogDetail.tsx";
import BlogEdit from "./components/BlogEdit.tsx";
import VerifyEmail from "./components/VerifyEmail.tsx";
import AuthForm from "./components/AuthForm.tsx";
import ForgotPassword from "./components/ForgotPassword.tsx";
import ResetPassword from "./components/ResetPassword.tsx";
import ProtectedRoute from "./components/protectedRoute.tsx";
// import TestPage from "./components/testpage.tsx";
export let router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/blog",
    element: (
      <ProtectedRoute>
        <BlogPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/blog/create",
    element: (
      <ProtectedRoute>
        <CreateBlog />
      </ProtectedRoute>
    ),
  },
  {
    path: "/blog/:id",
    element: <BlogDetail />,
  },
  {
    path: "/edit/:id",
    element: <BlogEdit />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },

  {
    path: "/register",
    element: <AuthForm />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/password-reset",
    element: <ResetPassword />,
  },
]);

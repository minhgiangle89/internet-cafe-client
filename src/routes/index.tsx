import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Dashboard } from "../pages/admin/Dashboard";
import { Home } from "../pages/client/Home";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { Typography, Container, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

// Error Page Component
const ErrorPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Lỗi Trang !
        </Typography>
        <Typography variant="body1" gutterBottom>
          Đã có lỗi xảy ra. Vui lòng liên hệ Admin
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          sx={{ mt: 2 }}
        >
          Quay về Trang chủ
        </Button>
      </Box>
    </Container>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute requiredRole={[2]}>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

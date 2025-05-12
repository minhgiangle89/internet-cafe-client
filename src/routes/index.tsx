import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Dashboard } from "../pages/admin/Dashboard";
import { Home } from "../pages/client/Home";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { Typography, Container, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { ComputerManagement } from "../pages/admin/ComputerManagement";
import { SessionManagement } from "../pages/admin/SessionManagement";
import { AccountManagement } from "../pages/admin/AccountManagement";
import { UserManagement } from "../pages/admin/UserManagement";
import { ClientDashboard } from "../pages/client/ClientDashboard";
import { UserProfile } from "../pages/common/UserProfile";

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
  // Admin routes
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute requiredRole={[2]}>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/computers",
    element: (
      <ProtectedRoute requiredRole={[2]}>
        <ComputerManagement />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/sessions",
    element: (
      <ProtectedRoute requiredRole={[2]}>
        <SessionManagement />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/accounts",
    element: (
      <ProtectedRoute requiredRole={[2]}>
        <AccountManagement />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute requiredRole={[2]}>
        <UserManagement />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  // Client routes
  {
    path: "/client/dashboard",
    element: (
      <ProtectedRoute requiredRole={[0, 1, 2]}>
        <ClientDashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  // Common routes
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

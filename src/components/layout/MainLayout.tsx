import React from "react";
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              Internet Cafe
            </Link>
          </Typography>
          {user ? (
            <>
              <Typography sx={{ mr: 2 }}>Xin chào, {user.username}</Typography>
              <Button color="inherit" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Đăng nhập
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Đăng ký
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {children}
      </Container>
      <Box component="footer" sx={{ py: 3, bgcolor: "background.paper" }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Internet Cafe Management System
        </Typography>
      </Box>
    </Box>
  );
};

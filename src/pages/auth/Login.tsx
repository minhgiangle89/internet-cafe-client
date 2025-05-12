import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { LoginRequest } from "../../types/dto";

interface LoginError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

export const Login = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authService.login(formData);

      if (response.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));

        if (response.data.role === 2) {
          navigate("/admin/dashboard");
        } else {
          navigate("/client/dashboard");
        }
      } else {
        setError(response.message || "Đăng nhập ko thành công");
      }
    } catch (err) {
      const error = err as LoginError;
      setError(
        error.response?.data?.message || error.message || "Lỗi khi đăng nhập"
      );
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center">
          Đăng nhập
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Tên đăng nhập"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Đăng nhập
          </Button>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
            <Link to="/register">Đăng ký tài khoản?</Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

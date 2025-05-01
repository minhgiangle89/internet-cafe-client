import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Grid,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { RegisterRequest } from "../../types/dto";

interface RegisterError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

export const Register = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    password: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: new Date(),
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: new Date(e.target.value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await authService.register(formData);

      if (response.success) {
        navigate("/login");
      } else {
        setError(response.message || "Đăng ký không thành công");
      }
    } catch (err) {
      const error = err as RegisterError;
      setError(
        error.response?.data?.message ||
          error.message ||
          "Đã xảy ra lỗi khi đăng ký"
      );
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center">
          Đăng ký tài khoản
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid sx={{ width: { xs: "100%" } }}>
              <TextField
                required
                fullWidth
                id="username"
                label="Tên đăng nhập"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Grid>
            <Grid sx={{ width: { xs: "100%" } }}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid sx={{ width: { xs: "100%" } }}>
              <TextField
                required
                fullWidth
                id="fullName"
                label="Họ và tên"
                name="fullName"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </Grid>
            <Grid sx={{ width: { xs: "100%" } }}>
              <TextField
                fullWidth
                id="phoneNumber"
                label="Số điện thoại"
                name="phoneNumber"
                autoComplete="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid sx={{ width: { xs: "100%" } }}>
              <TextField
                fullWidth
                id="dateOfBirth"
                label="Ngày sinh"
                name="dateOfBirth"
                type="date"
                InputLabelProps={{ shrink: true }}
                onChange={handleDateChange}
              />
            </Grid>
            <Grid sx={{ width: { xs: "100%" } }}>
              <TextField
                fullWidth
                id="address"
                label="Địa chỉ"
                name="address"
                autoComplete="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            {/*<Grid item xs={12} sm={6}> */}
            <Grid sx={{ width: { xs: "100%", sm: "50%" } }}>
              <TextField
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid sx={{ width: { xs: "100%", sm: "50%" } }}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Đăng ký
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

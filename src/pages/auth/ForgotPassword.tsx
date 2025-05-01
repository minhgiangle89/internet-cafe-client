import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";

interface ForgotPasswordError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setIsSubmitted(true);
    } catch (err) {
      const error = err as ForgotPasswordError;
      setError(
        error.response?.data?.message ||
          error.message ||
          "Đã xảy ra lỗi khi gửi yêu cầu"
      );
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center">
          Quên mật khẩu
        </Typography>

        {!isSubmitted ? (
          <>
            {error && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Typography sx={{ mt: 2 }}>
              Nhập email và đặt lại mật khẩu
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Gửi
              </Button>
              <Box sx={{ textAlign: "center" }}>
                <Link to="/login">Quay lại đăng nhập</Link>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Typography color="primary" sx={{ mt: 2 }}>
              Yêu cầu đã gửi
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Kiểm tra email của bạn để đặt lại mật khẩu
            </Typography>
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Link to="/login">Quay lại đăng nhập</Link>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

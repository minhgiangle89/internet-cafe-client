import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { MainLayout } from "../../components/layout/MainLayout";
import userService from "../../services/userService";
import { format } from "date-fns";
import { UserProfile } from "../../types/dto";

interface ProfileError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

export const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await userService.getUserProfile(user.id);

        if (response.success) {
          setUserProfile(response.data);
          setFormData({
            email: response.data.email || "",
            fullName: response.data.fullName || "",
            phoneNumber: response.data.phoneNumber || "",
            address: response.data.address || "",
            dateOfBirth: response.data.dateOfBirth
              ? format(new Date(response.data.dateOfBirth), "yyyy-MM-dd")
              : "",
          });
        } else {
          setErrorMessage(
            response.message || "Không thể tải thông tin người dùng"
          );
        }
      } catch (err) {
        const error = err as ProfileError;
        setErrorMessage(
          error.response?.data?.message ||
            error.message ||
            "Có lỗi xảy ra khi tải thông tin người dùng"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userProfile) {
      setFormData({
        email: userProfile.email || "",
        fullName: userProfile.fullName || "",
        phoneNumber: userProfile.phoneNumber || "",
        address: userProfile.address || "",
        dateOfBirth: userProfile.dateOfBirth
          ? format(new Date(userProfile.dateOfBirth), "yyyy-MM-dd")
          : "",
      });
    }
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await userService.updateUserProfile(user.id, {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth),
      });

      if (response.success) {
        setUserProfile(response.data);
        setSuccessMessage("Thông tin cá nhân đã được cập nhật thành công");
        setIsEditing(false);
      } else {
        setErrorMessage(
          response.message || "Có lỗi xảy ra khi cập nhật thông tin"
        );
      }
    } catch (err) {
      const error = err as ProfileError;
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi cập nhật thông tin"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Thông tin cá nhân
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid sx={{ width: { xs: "100%", sm: "50%" }, p: 1.5 }}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                value={userProfile?.username || ""}
                disabled
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid sx={{ width: { xs: "100%", sm: "50%" }, p: 1.5 }}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid sx={{ width: { xs: "100%" }, p: 1.5 }}>
              <TextField
                fullWidth
                name="fullName"
                label="Họ và tên"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid sx={{ width: { xs: "100%", sm: "50%" }, p: 1.5 }}>
              <TextField
                fullWidth
                name="phoneNumber"
                label="Số điện thoại"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid sx={{ width: { xs: "100%", sm: "50%" }, p: 1.5 }}>
              <TextField
                fullWidth
                name="dateOfBirth"
                label="Ngày sinh"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditing}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid sx={{ width: { xs: "100%" }, p: 1.5 }}>
              <TextField
                fullWidth
                name="address"
                label="Địa chỉ"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            {!isEditing ? (
              <Button variant="contained" onClick={handleEdit}>
                Chỉnh sửa
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{ mr: 2 }}
                  disabled={isSaving}
                >
                  Hủy bỏ
                </Button>
                <Button type="submit" variant="contained" disabled={isSaving}>
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>
    </MainLayout>
  );
};

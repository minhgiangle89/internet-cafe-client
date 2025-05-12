import React from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { MainLayout } from "../../components/layout/MainLayout";

export const Home = () => {
  return (
    <MainLayout>
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Chào mừng đến với Internet Cafe
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          color="text.secondary"
          gutterBottom
        >
          Hệ thống quản lý quán net hiện đại
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            <Grid sx={{ width: { xs: "100%", sm: "50%", md: "50%" }, p: 2 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Sinh Viên
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Đăng nhập để sử dụng máy tính và quản lý tài khoản cá nhân
                    của sinh viên
                  </Typography>
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    Đăng nhập
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              sx={{ width: { xs: "100%", sm: "50%", md: "33.333%" }, p: 2 }}
            >
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Giáo Viên
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Quản lý máy tính, phiên làm việc và tài khoản sinh viên
                  </Typography>
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    Đăng nhập
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </MainLayout>
  );
};

import React, { useState, useEffect } from "react";
import { Typography, Grid, Paper, CircularProgress, Box } from "@mui/material";
import { AdminLayout } from "../../components/layout/AdminLayout";
import statisticsService from "../../services/statisticsService";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalComputers: number;
  computersInUse: number;
  todayRevenue: number;
  monthRevenue: number;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const response = await statisticsService.getSummary();

        if (response.data?.success) {
          setStats(response.data.data);
          setError(null);
        } else {
          setError(response.data?.message || "Không thể tải thống kê");
        }
      } catch (err) {
        console.error("Lỗi khi tải dashboard:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Tổng số người dùng */}
        <Grid sx={{ width: { xs: "100%", sm: "50%", md: "33.333%" }, p: 1.5 }}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 140 }}
          >
            <Typography variant="h6" color="text.secondary">
              Tổng số người dùng
            </Typography>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {stats?.totalUsers ?? 0}
            </Typography>
          </Paper>
        </Grid>

        {/* Người dùng đang hoạt động */}
        <Grid sx={{ width: { xs: "100%", sm: "50%", md: "33.333%" }, p: 1.5 }}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 140 }}
          >
            <Typography variant="h6" color="text.secondary">
              Người dùng đang hoạt động
            </Typography>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {stats?.activeUsers ?? 0}
            </Typography>
          </Paper>
        </Grid>

        {/* Tổng số máy tính */}
        <Grid sx={{ width: { xs: "100%", sm: "50%", md: "33.333%" }, p: 1.5 }}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 140 }}
          >
            <Typography variant="h6" color="text.secondary">
              Tổng số máy tính
            </Typography>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {stats?.totalComputers ?? 0}
            </Typography>
          </Paper>
        </Grid>

        {/* Máy tính đang sử dụng */}
        <Grid sx={{ width: { xs: "100%", sm: "50%", md: "33.333%" }, p: 1.5 }}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 140 }}
          >
            <Typography variant="h6" color="text.secondary">
              Máy tính đang sử dụng
            </Typography>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {stats?.computersInUse ?? 0}
            </Typography>
          </Paper>
        </Grid>

        {/* Doanh thu hôm nay */}
        <Grid sx={{ width: { xs: "100%", sm: "50%", md: "33.333%" }, p: 1.5 }}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 140 }}
          >
            <Typography variant="h6" color="text.secondary">
              Doanh thu hôm nay
            </Typography>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {(stats?.todayRevenue ?? 0).toLocaleString("vi-VN")} VNĐ
            </Typography>
          </Paper>
        </Grid>

        {/* Doanh thu tháng */}
        <Grid sx={{ width: { xs: "100%", sm: "50%", md: "33.333%" }, p: 1.5 }}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 140 }}
          >
            <Typography variant="h6" color="text.secondary">
              Doanh thu tháng
            </Typography>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {(stats?.monthRevenue ?? 0).toLocaleString("vi-VN")} VNĐ
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

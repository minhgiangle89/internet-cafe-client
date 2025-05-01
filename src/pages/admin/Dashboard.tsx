// src/pages/admin/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Typography, Grid, Paper } from "@mui/material";
import { AdminLayout } from "../../components/layout/AdminLayout";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalComputers: number;
  computersInUse: number;
  todayRevenue: number;
  monthRevenue: number;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalComputers: 0,
    computersInUse: 0,
    todayRevenue: 0,
    monthRevenue: 0,
  });

  useEffect(() => {
    // Giả lập dữ liệu thống kê
    setStats({
      totalUsers: 45,
      activeUsers: 12,
      totalComputers: 25,
      computersInUse: 15,
      todayRevenue: 1500000,
      monthRevenue: 25000000,
    });
  }, []);

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
              {stats.totalUsers}
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
              {stats.activeUsers}
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
              {stats.totalComputers}
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
              {stats.computersInUse}
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
              {stats.todayRevenue.toLocaleString("vi-VN")} VNĐ
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
              {stats.monthRevenue.toLocaleString("vi-VN")} VNĐ
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

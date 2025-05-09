import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { AdminLayout } from "../../components/layout/AdminLayout";
import {
  PeopleAlt as PeopleIcon,
  Computer as ComputerIcon,
  MonetizationOn as MoneyIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import statisticsService from "../../services/statisticsService";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalComputers: number;
  computersInUse: number;
  todayRevenue: number;
  monthRevenue: number;
  recentSessions?: {
    id: number;
    computerName: string;
    userName: string;
    startTime: string;
    status: string;
  }[];
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
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Bảng điều khiển
      </Typography>

      <Grid container spacing={3}>
        {/* Tổng số người dùng */}
        <Grid sx={{ width: { xs: "100%", sm: "50%", md: "25%" } }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "#e3f2fd",
              borderRadius: 2,
            }}
          >
            <Box display="flex" alignItems="center">
              <PeopleIcon sx={{ fontSize: 40, color: "#1976d2", mr: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Tổng số người dùng
              </Typography>
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {stats?.totalUsers ?? 0}
            </Typography>
          </Paper>
        </Grid>

        {/* Người dùng đang hoạt động */}
        <Grid sx={{ width: { xs: "100%", sm: "50%", md: "25%" } }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "#e8f5e9",
              borderRadius: 2,
            }}
          >
            <Box display="flex" alignItems="center">
              <PeopleIcon sx={{ fontSize: 40, color: "#388e3c", mr: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Người dùng hoạt động
              </Typography>
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {stats?.activeUsers ?? 0}
            </Typography>
          </Paper>
        </Grid>

        {/* Tổng số máy tính */}
        <Grid sx={{ width: { xs: "100%", sm: "50%", md: "25%" } }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "#fff8e1",
              borderRadius: 2,
            }}
          >
            <Box display="flex" alignItems="center">
              <ComputerIcon sx={{ fontSize: 40, color: "#ffa000", mr: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Tổng số máy tính
              </Typography>
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {stats?.totalComputers ?? 0}
            </Typography>
          </Paper>
        </Grid>

        {/* Máy tính đang sử dụng */}
        <Grid sx={{ width: { xs: "100%", sm: "50%", md: "25%" } }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "#ffebee",
              borderRadius: 2,
            }}
          >
            <Box display="flex" alignItems="center">
              <ComputerIcon sx={{ fontSize: 40, color: "#d32f2f", mr: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Máy tính đang dùng
              </Typography>
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {stats?.computersInUse ?? 0}
            </Typography>
          </Paper>
        </Grid>

        {/* Doanh thu hôm nay */}
        <Grid sx={{ width: { xs: "100%", sm: "50%" } }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "#e0f7fa",
              borderRadius: 2,
            }}
          >
            <Box display="flex" alignItems="center">
              <MoneyIcon sx={{ fontSize: 40, color: "#0097a7", mr: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Doanh thu hôm nay
              </Typography>
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {(stats?.todayRevenue ?? 0).toLocaleString("vi-VN")} VNĐ
            </Typography>
          </Paper>
        </Grid>

        {/* Doanh thu tháng */}
        <Grid sx={{ width: { xs: "100%", sm: "50%" } }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "#f3e5f5",
              borderRadius: 2,
            }}
          >
            <Box display="flex" alignItems="center">
              <TrendingUpIcon sx={{ fontSize: 40, color: "#7b1fa2", mr: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Doanh thu tháng
              </Typography>
            </Box>
            <Typography component="p" variant="h4" sx={{ mt: 2 }}>
              {(stats?.monthRevenue ?? 0).toLocaleString("vi-VN")} VNĐ
            </Typography>
          </Paper>
        </Grid>

        {/* Phiên đang hoạt động */}
        <Grid sx={{ width: "100%" }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Phiên đang hoạt động
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Máy tính</TableCell>
                    <TableCell>Người dùng</TableCell>
                    <TableCell>Bắt đầu</TableCell>
                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats?.recentSessions ? (
                    stats.recentSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{session.id}</TableCell>
                        <TableCell>{session.computerName}</TableCell>
                        <TableCell>{session.userName}</TableCell>
                        <TableCell>
                          {new Date(session.startTime).toLocaleString("vi-VN")}
                        </TableCell>
                        <TableCell>
                          <Box
                            component="span"
                            sx={{
                              py: 0.5,
                              px: 1.5,
                              borderRadius: 1,
                              bgcolor:
                                session.status === "Active"
                                  ? "#e8f5e9"
                                  : "#ffebee",
                              color:
                                session.status === "Active"
                                  ? "#2e7d32"
                                  : "#c62828",
                            }}
                          >
                            {session.status === "Active"
                              ? "Hoạt động"
                              : "Kết thúc"}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Không có phiên nào đang hoạt động
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

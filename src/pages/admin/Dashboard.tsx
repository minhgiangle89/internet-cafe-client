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
  Chip,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
} from "@mui/material";
import { AdminLayout } from "../../components/layout/AdminLayout";
import {
  PeopleAlt as PeopleIcon,
  Computer as ComputerIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as TimeIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import sessionService from "../../services/sessionService";
// import computerService from "../../services/computerService";
import userService from "../../services/userService";
import { formatDuration } from "../../utils/formatters";
import { ComputerStatusSummaryDTO, SessionDTO, UserDTO } from "../../types/dto";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface UserInfo {
  [userId: number]: UserDTO;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const Dashboard = () => {
  const [computerStatusSummary, setComputerStatusSummary] =
    useState<ComputerStatusSummaryDTO | null>(null);
  const [activeSessions, setActiveSessions] = useState<SessionDTO[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchUserInfo = async (userId: number) => {
    if (userInfo[userId]) return;

    try {
      const response = await userService.getUserById(userId);
      if (response.success) {
        setUserInfo((prev) => ({
          ...prev,
          [userId]: response.data,
        }));
      }
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
    }
  };

  const fetchDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      setIsRefreshing(true);

      // Fetch computer status summary
      const computerSummaryResponse =
        await sessionService.getComputerStatusSummary();
      if (computerSummaryResponse.success) {
        setComputerStatusSummary(computerSummaryResponse.data);

        // Fetch user info for computers in use
        const usersToFetch = computerSummaryResponse.data.computerDetails
          .filter((c) => c.currentUserId)
          .map((c) => c.currentUserId!)
          .filter((userId, index, arr) => arr.indexOf(userId) === index);

        await Promise.all(usersToFetch.map((userId) => fetchUserInfo(userId)));
      }

      // Fetch active sessions
      const sessionsResponse = await sessionService.getActiveSessions();
      if (sessionsResponse.success) {
        setActiveSessions(sessionsResponse.data);
      }

      setError(null);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Lỗi khi tải dashboard:", err);
      setError("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => fetchDashboardData(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    fetchDashboardData(false);
  };

  const getStatusChip = (status: number) => {
    switch (status) {
      case 0:
        return <Chip label="Máy trống" color="success" size="small" />;
      case 1:
        return <Chip label="Đang sử dụng" color="primary" size="small" />;
      case 2:
        return <Chip label="Bảo trì" color="warning" size="small" />;
      case 3:
        return <Chip label="Hỏng" color="error" size="small" />;
      default:
        return <Chip label="Không xác định" color="default" size="small" />;
    }
  };

  const getUsagePercentage = () => {
    if (!computerStatusSummary) return 0;
    return (
      (computerStatusSummary.computersInUse /
        computerStatusSummary.totalComputers) *
      100
    );
  };

  const getSessionStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Đang hoạt động";
      case 1:
        return "Hoàn thành";
      case 2:
        return "Đã chấm dứt";
      case 3:
        return "Hết thời gian";
      default:
        return "Không xác định";
    }
  };

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">Bảng điều khiển</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Cập nhật lần cuối: {lastRefresh.toLocaleTimeString("vi-VN")}
          </Typography>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{ width: { xs: "100%", sm: "50%", md: "33%" } }}>
          <Card sx={{ bgcolor: "#e3f2fd", height: 140 }}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6" color="#1976d2">
                  Phiên hoạt động
                </Typography>
                <PeopleIcon sx={{ fontSize: 40, color: "#1976d2" }} />
              </Box>
              <Typography variant="h4" sx={{ mt: "auto" }}>
                {activeSessions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang sử dụng máy
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ width: { xs: "100%", sm: "50%", md: "25%" } }}>
          <Card sx={{ bgcolor: "#e8f5e9", height: 140 }}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6" color="#388e3c">
                  Máy tính
                </Typography>
                <ComputerIcon sx={{ fontSize: 40, color: "#388e3c" }} />
              </Box>
              <Typography variant="h4" sx={{ mt: "auto" }}>
                {computerStatusSummary?.totalComputers ?? 0}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={getUsagePercentage()}
                sx={{ mt: 1, height: 8, borderRadius: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                Đang sử dụng: {computerStatusSummary?.computersInUse ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ width: { xs: "100%", sm: "50%", md: "33%" } }}>
          <Card sx={{ bgcolor: "#f3e5f5", height: 140 }}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6" color="#7b1fa2">
                  Bảo trì/Hỏng
                </Typography>
                <TrendingUpIcon sx={{ fontSize: 40, color: "#7b1fa2" }} />
              </Box>
              <Typography variant="h4" sx={{ mt: "auto" }}>
                {(computerStatusSummary?.computersInMaintenance || 0) +
                  (computerStatusSummary?.computersOutOfOrder || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cần chú ý
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Status Overview */}
      {computerStatusSummary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid sx={{ width: { xs: "100%" } }}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Tình trạng máy tính
              </Typography>
              <Grid container spacing={2}>
                <Grid sx={{ width: { xs: "50%", sm: "25%" } }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h3"
                      sx={{ color: "#4caf50", fontWeight: "bold" }}
                    >
                      {computerStatusSummary.availableComputers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Máy trống
                    </Typography>
                  </Box>
                </Grid>
                <Grid sx={{ width: { xs: "50%", sm: "25%" } }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h3"
                      sx={{ color: "#2196f3", fontWeight: "bold" }}
                    >
                      {computerStatusSummary.computersInUse}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Đang sử dụng
                    </Typography>
                  </Box>
                </Grid>
                <Grid sx={{ width: { xs: "50%", sm: "25%" } }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h3"
                      sx={{ color: "#ff9800", fontWeight: "bold" }}
                    >
                      {computerStatusSummary.computersInMaintenance}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bảo trì
                    </Typography>
                  </Box>
                </Grid>
                <Grid sx={{ width: { xs: "50%", sm: "25%" } }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h3"
                      sx={{ color: "#f44336", fontWeight: "bold" }}
                    >
                      {computerStatusSummary.computersOutOfOrder}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hỏng
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Tabs for different views */}
      <Paper sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Chi tiết máy tính" />
            <Tab label="Phiên đang hoạt động" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Tình trạng chi tiết máy tính
          </Typography>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Máy tính</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Người dùng</TableCell>
                  <TableCell>Thời gian sử dụng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {computerStatusSummary?.computerDetails.map((computer) => (
                  <TableRow key={computer.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {computer.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {computer.ipAddress} | {computer.location}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{getStatusChip(computer.status)}</TableCell>
                    <TableCell>
                      {computer.currentUserId ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar sx={{ width: 32, height: 32 }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2">
                              {userInfo[computer.currentUserId]?.fullName ||
                                `User ${computer.currentUserId}`}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              ID: {computer.currentUserId}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {computer.sessionStartTime ? (
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <TimeIcon fontSize="small" />
                            {formatDuration(computer.sessionDuration || "0")}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Bắt đầu:{" "}
                            {new Date(
                              computer.sessionStartTime
                            ).toLocaleTimeString("vi-VN")}
                          </Typography>
                        </Box>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
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
                  <TableCell>Thời gian</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeSessions && activeSessions.length > 0 ? (
                  activeSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.id}</TableCell>
                      <TableCell>{session.computerName}</TableCell>
                      <TableCell>{session.userName}</TableCell>
                      <TableCell>
                        {new Date(session.startTime).toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell>{formatDuration(session.duration)}</TableCell>
                      <TableCell>
                        <Chip
                          label={getSessionStatusText(session.status)}
                          color={session.status === 0 ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary">
                        Không có phiên nào đang hoạt động
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </AdminLayout>
  );
};

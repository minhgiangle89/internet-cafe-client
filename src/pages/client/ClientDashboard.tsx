import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { MainLayout } from "../../components/layout/MainLayout";
import computerService from "../../services/computerService";
import sessionService from "../../services/sessionService";
import accountService from "../../services/accountService";
import userService from "../../services/userService";
import { ComputerDTO, SessionDTO, AccountDTO, UserDTO } from "../../types/dto";
import { formatDuration } from "../../utils/formatters";

export const ClientDashboard = () => {
  const [availableComputers, setAvailableComputers] = useState<ComputerDTO[]>(
    []
  );
  const [activeSession, setActiveSession] = useState<SessionDTO | null>(null);
  const [accountDetails, setAccountDetails] = useState<AccountDTO | null>(null);
  const [userDetails, setUserDetails] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get current user details first
      const userResponse = await userService.getCurrentUser();

      if (!userResponse.success) {
        setError("Không thể tải thông tin người dùng");
        return;
      }

      setUserDetails(userResponse.data);
      const userId = userResponse.data.id;

      // Check if user has active session
      const hasActiveSessionResponse = await sessionService.hasActiveSession(
        userId
      );

      if (hasActiveSessionResponse.success && hasActiveSessionResponse.data) {
        // User has active session, get session details
        const userSessionsResponse = await sessionService.getSessionsByUserId(
          userId
        );

        if (userSessionsResponse.success) {
          const activeUserSession = userSessionsResponse.data.find(
            (s) => s.status === 0
          );
          setActiveSession(activeUserSession || null);
        }
      } else {
        setActiveSession(null);
      }

      // Get account details
      const accountResponse = await accountService.getAccountByUserId(userId);

      if (accountResponse.success) {
        setAccountDetails(accountResponse.data);
      }

      // Get available computers only if user doesn't have active session
      if (!hasActiveSessionResponse.data) {
        const computersResponse = await computerService.getAvailableComputers();

        if (computersResponse.success) {
          setAvailableComputers(computersResponse.data);
        }
      }

      setError(null);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleStartSession = async (computerId: number) => {
    if (!userDetails) return;

    try {
      const response = await sessionService.startSession({
        userId: userDetails.id,
        computerId,
      });

      if (response.success) {
        // Refresh data to show active session
        fetchData();
      } else {
        setError(response.message || "Không thể bắt đầu phiên sử dụng");
      }
    } catch (err) {
      console.error("Lỗi khi bắt đầu phiên sử dụng:", err);
      setError("Đã xảy ra lỗi khi bắt đầu phiên sử dụng");
    }
  };

  const handleEndSession = async () => {
    if (!activeSession) return;

    try {
      const response = await sessionService.endSession({
        sessionId: activeSession.id,
      });

      if (response.success) {
        // Refresh data to show available computers
        fetchData();
      } else {
        setError(response.message || "Không thể kết thúc phiên sử dụng");
      }
    } catch (err) {
      console.error("Lỗi khi kết thúc phiên sử dụng:", err);
      setError("Đã xảy ra lỗi khi kết thúc phiên sử dụng");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Bảng điều khiển
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{ width: { xs: "100%", sm: "50%" } }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin người dùng
            </Typography>
            {userDetails && (
              <>
                <Typography variant="body1">
                  Họ tên: {userDetails.fullName}
                </Typography>
                <Typography variant="body1">
                  Email: {userDetails.email}
                </Typography>
                <Typography variant="body1">
                  Tên đăng nhập: {userDetails.username}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
        <Grid sx={{ width: { xs: "100%", sm: "50%" } }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin tài khoản
            </Typography>
            {accountDetails ? (
              <>
                <Typography variant="body1">
                  Số dư: {accountDetails.balance.toLocaleString("vi-VN")} VNĐ
                </Typography>
                <Typography variant="body1">
                  Lần nạp cuối:{" "}
                  {new Date(accountDetails.lastDepositDate).toLocaleString(
                    "vi-VN"
                  )}
                </Typography>
              </>
            ) : (
              <Typography>
                Bạn chưa có tài khoản. Vui lòng liên hệ quản trị viên để tạo tài
                khoản.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {activeSession ? (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Phiên đang hoạt động
          </Typography>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body1">
              Máy tính: {activeSession.computerName}
            </Typography>
            <Typography variant="body1">
              Bắt đầu:{" "}
              {new Date(activeSession.startTime).toLocaleString("vi-VN")}
            </Typography>
            <Typography variant="body1">
              Thời gian: {formatDuration(activeSession.duration)}
            </Typography>
            <Typography variant="body1">
              Chi phí hiện tại:{" "}
              {activeSession.totalCost.toLocaleString("vi-VN")} VNĐ
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleEndSession}
              >
                Kết thúc phiên
              </Button>
            </Box>
          </Paper>
        </Box>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Máy tính khả dụng
          </Typography>
          {availableComputers.length === 0 ? (
            <Typography>Không có máy tính khả dụng</Typography>
          ) : (
            <Grid container spacing={3}>
              {availableComputers.map((computer) => (
                <Grid
                  sx={{ width: { xs: "100%", sm: "50%", md: "25%" } }}
                  key={computer.id}
                >
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {computer.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Vị trí: {computer.location}
                      </Typography>
                      <Typography variant="body2">
                        Giá/giờ: {computer.hourlyRate.toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </Typography>
                      <Typography variant="body2">
                        {computer.specifications}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleStartSession(computer.id)}
                        disabled={
                          !accountDetails ||
                          accountDetails.balance < computer.hourlyRate / 4
                        }
                      >
                        Sử dụng máy
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </MainLayout>
  );
};

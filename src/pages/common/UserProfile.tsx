import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
} from "@mui/material";
import { MainLayout } from "../../components/layout/MainLayout";
import userService from "../../services/userService";
import accountService from "../../services/accountService";
import sessionService from "../../services/sessionService";
import {
  UserDTO,
  UpdateUserDTO,
  ChangePasswordDTO,
  AccountDTO,
  TransactionDTO,
  SessionDTO,
} from "../../types/dto";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { formatDuration } from "../../utils/formatters";
interface UserError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const UserProfile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [userDetails, setUserDetails] = useState<UserDTO | null>(null);
  const [accountDetails, setAccountDetails] = useState<AccountDTO | null>(null);
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [sessions, setSessions] = useState<SessionDTO[]>([]);

  // Form states
  const [profileForm, setProfileForm] = useState<UpdateUserDTO>({
    email: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: new Date(),
  });

  const [passwordForm, setPasswordForm] = useState<ChangePasswordDTO>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Get current user details
      const userResponse = await userService.getCurrentUser();

      if (!userResponse.success) {
        setError("Không thể tải thông tin người dùng");
        return;
      }

      setUserDetails(userResponse.data);

      // Initialize profile form with user data
      setProfileForm({
        email: userResponse.data.email,
        fullName: userResponse.data.fullName,
        phoneNumber: userResponse.data.phoneNumber || "",
        address: userResponse.data.address || "",
        dateOfBirth: new Date(userResponse.data.dateOfBirth),
      });

      // Get account details if available
      try {
        const accountResponse = await accountService.getAccountByUserId(
          userResponse.data.id
        );

        if (accountResponse.success) {
          setAccountDetails(accountResponse.data);

          // Get transaction history
          const transactionsResponse =
            await accountService.getTransactionsByAccountId(
              accountResponse.data.id
            );
          if (transactionsResponse.success) {
            setTransactions(transactionsResponse.data);
          }
        }
      } catch (err) {
        const error = err as UserError;
        setError(
          error.response?.data?.message ||
            error.message ||
            "Không có tài khoản hoặc không thể tải thông tin tài khoản"
        );
      }

      // Get session history
      const sessionsResponse = await sessionService.getSessionsByUserId(
        userResponse.data.id
      );
      if (sessionsResponse.success) {
        setSessions(sessionsResponse.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setProfileForm((prev) => ({
        ...prev,
        dateOfBirth: date,
      }));
    }
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    if (!userDetails) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await userService.updateUser(
        userDetails.id,
        profileForm
      );

      if (response.success) {
        setSuccess("Cập nhật thông tin thành công");
        // Refresh user data
        fetchData();
      } else {
        setError(response.message || "Không thể cập nhật thông tin");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin:", err);
      setError("Đã xảy ra lỗi khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!userDetails) return;

    // Validate password confirmation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await userService.changePassword(
        userDetails.id,
        passwordForm
      );

      if (response.success) {
        setSuccess("Đổi mật khẩu thành công");
        // Reset password form
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(response.message || "Không thể đổi mật khẩu");
      }
    } catch (err) {
      console.error("Lỗi khi đổi mật khẩu:", err);
      setError("Đã xảy ra lỗi khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  const getTransactionTypeText = (type: number) => {
    switch (type) {
      case 0:
        return "Nạp tiền";
      case 1:
        return "Rút tiền";
      case 2:
        return "Sử dụng máy tính";
      case 3:
        return "Phí dịch vụ";
      case 4:
        return "Hoàn tiền";
      default:
        return "Không xác định";
    }
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

  if (loading && !userDetails) {
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
        Hồ sơ người dùng
      </Typography>

      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: "error.light", borderRadius: 1 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {success && (
        <Box sx={{ mb: 2, p: 2, bgcolor: "success.light", borderRadius: 1 }}>
          <Typography color="success.dark">{success}</Typography>
        </Box>
      )}

      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
          >
            <Tab
              label="Thông tin cá nhân"
              id="profile-tab-0"
              aria-controls="profile-tabpanel-0"
            />
            <Tab
              label="Đổi mật khẩu"
              id="profile-tab-1"
              aria-controls="profile-tabpanel-1"
            />
            <Tab
              label="Thông tin tài khoản"
              id="profile-tab-2"
              aria-controls="profile-tabpanel-2"
            />
            <Tab
              label="Lịch sử phiên"
              id="profile-tab-3"
              aria-controls="profile-tabpanel-3"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin cá nhân
              </Typography>
              <Grid container spacing={2}>
                <Grid sx={{ width: { xs: "100%", sm: "50%" } }}>
                  <TextField
                    fullWidth
                    label="Tên đăng nhập"
                    value={userDetails?.username || ""}
                    disabled
                    margin="normal"
                  />
                </Grid>
                <Grid sx={{ width: { xs: "100%", sm: "50%" } }}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    value={profileForm.email}
                    onChange={handleProfileInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid sx={{ width: { xs: "100%" } }}>
                  <TextField
                    fullWidth
                    name="fullName"
                    label="Họ và tên"
                    value={profileForm.fullName}
                    onChange={handleProfileInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid sx={{ width: { xs: "100%", sm: "50%" } }}>
                  <TextField
                    fullWidth
                    name="phoneNumber"
                    label="Số điện thoại"
                    value={profileForm.phoneNumber}
                    onChange={handleProfileInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid sx={{ width: { xs: "100%", sm: "50%" } }}>
                  <DatePicker
                    label="Ngày sinh"
                    value={profileForm.dateOfBirth}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: { fullWidth: true, margin: "normal" },
                    }}
                  />
                </Grid>
                <Grid sx={{ width: { xs: "100%" } }}>
                  <TextField
                    fullWidth
                    name="address"
                    label="Địa chỉ"
                    value={profileForm.address}
                    onChange={handleProfileInputChange}
                    margin="normal"
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid sx={{ width: { xs: "100%" } }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateProfile}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Cập nhật thông tin"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </LocalizationProvider>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Đổi mật khẩu
            </Typography>
            <Grid container spacing={2}>
              <Grid sx={{ width: { xs: "100%" } }}>
                <TextField
                  fullWidth
                  name="currentPassword"
                  label="Mật khẩu hiện tại"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid sx={{ width: { xs: "100%" } }}>
                <TextField
                  fullWidth
                  name="newPassword"
                  label="Mật khẩu mới"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid sx={{ width: { xs: "100%" } }}>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  label="Xác nhận mật khẩu mới"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInputChange}
                  margin="normal"
                  error={
                    passwordForm.newPassword !== passwordForm.confirmPassword &&
                    passwordForm.confirmPassword !== ""
                  }
                  helperText={
                    passwordForm.newPassword !== passwordForm.confirmPassword &&
                    passwordForm.confirmPassword !== ""
                      ? "Mật khẩu không khớp"
                      : ""
                  }
                />
              </Grid>
              <Grid sx={{ width: { xs: "100%" } }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleChangePassword}
                  disabled={
                    loading ||
                    !passwordForm.currentPassword ||
                    !passwordForm.newPassword ||
                    passwordForm.newPassword !== passwordForm.confirmPassword
                  }
                >
                  {loading ? <CircularProgress size={24} /> : "Đổi mật khẩu"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin tài khoản
            </Typography>

            {accountDetails ? (
              <>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h5" color="primary">
                      Số dư: {accountDetails.balance.toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Lần nạp cuối:{" "}
                      {new Date(accountDetails.lastDepositDate).toLocaleString(
                        "vi-VN"
                      )}
                    </Typography>
                    <Typography variant="body2">
                      Lần sử dụng cuối:{" "}
                      {new Date(accountDetails.lastUsageDate).toLocaleString(
                        "vi-VN"
                      )}
                    </Typography>
                  </CardContent>
                </Card>

                <Typography variant="h6" gutterBottom>
                  Lịch sử giao dịch
                </Typography>

                {transactions.length > 0 ? (
                  <Box sx={{ maxHeight: "400px", overflow: "auto" }}>
                    {transactions.map((transaction) => (
                      <Card key={transaction.id} sx={{ mb: 2 }}>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="subtitle1">
                              {getTransactionTypeText(transaction.type)}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: "bold",
                                color:
                                  transaction.amount < 0
                                    ? "error.main"
                                    : "success.main",
                              }}
                            >
                              {transaction.amount.toLocaleString("vi-VN")} VNĐ
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(transaction.timestamp).toLocaleString(
                              "vi-VN"
                            )}
                          </Typography>
                          {transaction.description && (
                            <Typography variant="body2">
                              {transaction.description}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography>Chưa có giao dịch nào</Typography>
                )}
              </>
            ) : (
              <Typography>
                Bạn chưa có tài khoản. Vui lòng liên hệ quản trị viên để tạo tài
                khoản.
              </Typography>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Lịch sử sử dụng máy tính
            </Typography>

            {sessions.length > 0 ? (
              <Box sx={{ maxHeight: "400px", overflow: "auto" }}>
                {sessions.map((session) => (
                  <Card key={session.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle1">
                          Máy: {session.computerName}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            color:
                              session.status === 0
                                ? "primary.main"
                                : "text.primary",
                          }}
                        >
                          {getSessionStatusText(session.status)}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Bắt đầu:{" "}
                        {new Date(session.startTime).toLocaleString("vi-VN")}
                      </Typography>
                      {session.endTime && (
                        <Typography variant="body2">
                          Kết thúc:{" "}
                          {new Date(session.endTime).toLocaleString("vi-VN")}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        Thời gian: {formatDuration(session.duration)}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        Chi phí: {session.totalCost.toLocaleString("vi-VN")} VNĐ
                      </Typography>
                      {session.notes && (
                        <Typography variant="body2" color="text.secondary">
                          Ghi chú: {session.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography>Chưa có phiên sử dụng nào</Typography>
            )}
          </Paper>
        </TabPanel>
      </Box>
    </MainLayout>
  );
};

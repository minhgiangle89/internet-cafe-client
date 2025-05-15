import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import { AdminLayout } from "../../components/layout/AdminLayout";
import accountService from "../../services/accountService";
import sessionService from "../../services/sessionService";
import userService from "../../services/userService";
import { AccountDTO, SessionDTO, UserDTO } from "../../types/dto";
import { formatDuration } from "../../utils/formatters";

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const AccountManagement = () => {
  const [accounts, setAccounts] = useState<AccountDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionDTO[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [selectedAccountDetails, setSelectedAccountDetails] =
    useState<AccountDTO | null>(null);
  const [userInfo, setUserInfo] = useState<{ [key: number]: UserDTO }>({});

  // State để lưu tổng giờ sử dụng cho mỗi account
  const [accountUsageHours, setAccountUsageHours] = useState<{
    [key: number]: number;
  }>({});

  // Function để tính tổng giờ sử dụng từ sessions
  const calculateUsageHours = (sessions: SessionDTO[]): number => {
    return sessions
      .filter((session) => session.status !== 0) // Không tính sessions đang hoạt động
      .reduce((total, session) => {
        // Parse duration string to hours
        if (session.duration && session.duration !== "00:00:00") {
          const durationParts = session.duration.split(":");
          const hours = parseInt(durationParts[0]);
          const minutes = parseInt(durationParts[1]);
          const seconds = parseInt(durationParts[2]);

          const totalHours = hours + minutes / 60 + seconds / 3600;
          return total + totalHours;
        }
        return total;
      }, 0);
  };

  const loadUserInfo = async (userId: number) => {
    if (userInfo[userId]) return;

    try {
      const response = await userService.getUserById(userId);
      if (response.success) {
        setUserInfo((prev) => ({
          ...prev,
          [userId]: response.data,
        }));
      }
    } catch (err) {
      console.error(`Lỗi tải user ${userId}:`, err);
    }
  };

  const loadUsageHours = async (account: AccountDTO) => {
    try {
      await loadUserInfo(account.userId);
      const response = await sessionService.getSessionsByUserId(account.userId);
      if (response.success) {
        const totalHours = calculateUsageHours(response.data);
        setAccountUsageHours((prev) => ({
          ...prev,
          [account.id]: totalHours,
        }));
      }
    } catch (err) {
      console.error("Lỗi khi tính giờ sử dụng:", err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const accountsResponse = await accountService.getAllAccounts();
      if (accountsResponse.success) {
        setAccounts(accountsResponse.data);
        setError(null);

        for (const account of accountsResponse.data) {
          await loadUsageHours(account);
        }
      } else {
        setError(
          accountsResponse.message || "Không thể tải danh sách tài khoản"
        );
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

  const handleViewSessions = async (account: AccountDTO) => {
    try {
      setSelectedAccountDetails(account);
      setTabValue(1);
      await loadUserInfo(account.userId);

      const response = await sessionService.getSessionsByUserId(account.userId);
      if (response.success) {
        setSessions(response.data);

        const totalHours = calculateUsageHours(response.data);
        setAccountUsageHours((prev) => ({
          ...prev,
          [account.id]: totalHours,
        }));
      } else {
        setError(response.message || "Không thể tải lịch sử sử dụng");
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử sử dụng:", err);
      setError("Đã xảy ra lỗi khi tải lịch sử sử dụng");
    }
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setSelectedAccountDetails(null);
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

  if (loading) {
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

  return (
    <AdminLayout>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleChangeTab}>
            <Tab label="Danh sách tài khoản" />
            <Tab label="Lịch sử sử dụng" disabled={!selectedAccountDetails} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h4" gutterBottom>
            Quản lý tài khoản
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {accounts.length === 0 ? (
            <Typography>Không có tài khoản</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã TK</TableCell>
                    <TableCell>Người dùng</TableCell>
                    <TableCell>Tổng giờ sử dụng</TableCell>
                    <TableCell>Lần sử dụng cuối</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.id}</TableCell>
                      <TableCell>{account.userName}</TableCell>
                      <TableCell>
                        {accountUsageHours[account.id] !== undefined
                          ? `${accountUsageHours[account.id].toFixed(1)} giờ`
                          : "Đang tính..."}
                      </TableCell>
                      <TableCell>
                        {new Date(account.lastUsageDate).toLocaleString(
                          "vi-VN"
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            color="info"
                            variant="outlined"
                            onClick={() => handleViewSessions(account)}
                          >
                            Lịch sử
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {selectedAccountDetails && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5">Lịch sử sử dụng</Typography>
                <Typography variant="subtitle1">
                  Tài khoản: {selectedAccountDetails.userName} (Mã:{" "}
                  {selectedAccountDetails.id})
                </Typography>
                <Typography variant="subtitle2">
                  Tổng giờ sử dụng:{" "}
                  {accountUsageHours[selectedAccountDetails.id] !== undefined
                    ? `${accountUsageHours[selectedAccountDetails.id].toFixed(
                        1
                      )} giờ`
                    : "Đang tính..."}
                </Typography>
              </Box>

              {sessions.length === 0 ? (
                <Typography>Không có lịch sử sử dụng</Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã phiên</TableCell>
                        <TableCell>Máy tính</TableCell>
                        <TableCell>Bắt đầu</TableCell>
                        <TableCell>Kết thúc</TableCell>
                        <TableCell>Thời gian sử dụng</TableCell>
                        <TableCell>Trạng thái</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>{session.id}</TableCell>
                          <TableCell>{session.computerName}</TableCell>
                          <TableCell>
                            {new Date(session.startTime).toLocaleString(
                              "vi-VN"
                            )}
                          </TableCell>
                          <TableCell>
                            {session.endTime
                              ? new Date(session.endTime).toLocaleString(
                                  "vi-VN"
                                )
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {formatDuration(session.duration)}
                          </TableCell>
                          <TableCell>
                            {getSessionStatusText(session.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </TabPanel>
      </Box>
    </AdminLayout>
  );
};

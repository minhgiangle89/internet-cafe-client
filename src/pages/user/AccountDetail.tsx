// src/pages/user/AccountDetail.tsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  Divider,
  Button,
  Alert,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
} from "@mui/material";
import { MainLayout } from "../../components/layout/MainLayout";
import accountService from "../../services/accountService";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { AccountInfo, Transaction } from "../../types/dto";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface AccountError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const AccountDetail = () => {
  const [accountInfo, setAccountInfo] = useState<AccountInfo>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [tabValue, setTabValue] = useState(0);

  // Deposit state
  const [depositAmount, setDepositAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("0");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawReason, setWithdrawReason] = useState("");
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  const fetchAccountInfo = async () => {
    if (!user) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await accountService.getAccountByUserId(user.id);

      if (response.success) {
        setAccountInfo(response.data);

        // Fetch account details and transactions
        const detailsResponse = await accountService.getAccountDetails(
          response.data.id
        );
        if (detailsResponse.success) {
          setTransactions(detailsResponse.data.recentTransactions || []);
        }
      } else {
        setErrorMessage(
          response.message || "Không thể tải thông tin tài khoản"
        );
      }
    } catch (err) {
      const error = err as AccountError;
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi tải thông tin tài khoản"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDepositDialog = () => {
    setDepositAmount("");
    setPaymentMethod("0");
    setReferenceNumber("");
    setIsDepositDialogOpen(true);
  };

  const handleCloseDepositDialog = () => {
    setIsDepositDialogOpen(false);
  };

  const handleOpenWithdrawDialog = () => {
    setWithdrawAmount("");
    setWithdrawReason("");
    setIsWithdrawDialogOpen(true);
  };

  const handleCloseWithdrawDialog = () => {
    setIsWithdrawDialogOpen(false);
  };

  const handleDeposit = async () => {
    if (!accountInfo) return;

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage("Số tiền nạp phải lớn hơn 0");
      return;
    }

    setIsDepositing(true);
    setErrorMessage("");

    try {
      const response = await accountService.deposit({
        accountId: accountInfo.id,
        amount,
        paymentMethod: parseInt(paymentMethod),
        referenceNumber: referenceNumber || undefined,
      });

      if (response.success) {
        setSuccessMessage(
          `Nạp thành công ${amount.toLocaleString("vi-VN")} VNĐ vào tài khoản`
        );
        handleCloseDepositDialog();
        fetchAccountInfo(); // Refresh account info
      } else {
        setErrorMessage(response.message || "Có lỗi xảy ra khi nạp tiền");
      }
    } catch (err) {
      const error = err as AccountError;
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi nạp tiền"
      );
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!accountInfo) return;

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage("Số tiền rút phải lớn hơn 0");
      return;
    }

    if (amount > accountInfo.balance) {
      setErrorMessage("Số dư không đủ để thực hiện giao dịch này");
      return;
    }

    setIsWithdrawing(true);
    setErrorMessage("");

    try {
      const response = await accountService.withdraw({
        accountId: accountInfo.id,
        amount,
        reason: withdrawReason || undefined,
      });

      if (response.success) {
        setSuccessMessage(
          `Rút thành công ${amount.toLocaleString("vi-VN")} VNĐ từ tài khoản`
        );
        handleCloseWithdrawDialog();
        fetchAccountInfo(); // Refresh account info
      } else {
        setErrorMessage(response.message || "Có lỗi xảy ra khi rút tiền");
      }
    } catch (err) {
      const error = err as AccountError;
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi rút tiền"
      );
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getTransactionTypeText = (type: number) => {
    switch (type) {
      case 0:
        return "Nạp tiền";
      case 1:
        return "Rút tiền";
      case 2:
        return "Sử dụng máy";
      case 3:
        return "Phí dịch vụ";
      case 4:
        return "Hoàn tiền";
      default:
        return "Khác";
    }
  };

  const getPaymentMethodText = (method: number) => {
    switch (method) {
      case 0:
        return "Tiền mặt";
      case 1:
        return "Thẻ tín dụng";
      case 2:
        return "Thẻ ghi nợ";
      case 3:
        return "Ví điện tử";
      default:
        return "Khác";
    }
  };

  if (isLoading && !accountInfo) {
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
          Thông tin tài khoản
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

        {accountInfo ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 4,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5">
                  Số dư: {accountInfo.balance.toLocaleString("vi-VN")} VNĐ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lần nạp cuối:{" "}
                  {format(
                    new Date(accountInfo.lastDepositDate),
                    "dd/MM/yyyy HH:mm",
                    { locale: vi }
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lần sử dụng cuối:{" "}
                  {format(
                    new Date(accountInfo.lastUsageDate),
                    "dd/MM/yyyy HH:mm",
                    { locale: vi }
                  )}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenDepositDialog}
                >
                  Nạp tiền
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleOpenWithdrawDialog}
                  disabled={accountInfo.balance <= 0}
                >
                  Rút tiền
                </Button>
              </Box>
            </Box>

            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="account tabs"
                >
                  <Tab label="Lịch sử giao dịch" id="account-tab-0" />
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0}>
                {transactions.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Thời gian</TableCell>
                          <TableCell>Loại giao dịch</TableCell>
                          <TableCell>Số tiền</TableCell>
                          <TableCell>Phương thức</TableCell>
                          <TableCell>Mô tả</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {format(
                                new Date(transaction.timestamp),
                                "dd/MM/yyyy HH:mm",
                                { locale: vi }
                              )}
                            </TableCell>
                            <TableCell>
                              {getTransactionTypeText(transaction.type)}
                            </TableCell>
                            <TableCell
                              sx={{
                                color:
                                  transaction.amount < 0
                                    ? "error.main"
                                    : "success.main",
                                fontWeight: "bold",
                              }}
                            >
                              {transaction.amount.toLocaleString("vi-VN")} VNĐ
                            </TableCell>
                            <TableCell>
                              {transaction.paymentMethod !== null
                                ? getPaymentMethodText(
                                    transaction.paymentMethod
                                  )
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {transaction.description || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    Chưa có giao dịch nào
                  </Typography>
                )}
              </TabPanel>
            </Box>
          </>
        ) : (
          <Alert severity="info">
            Bạn chưa có tài khoản. Vui lòng liên hệ quản trị viên.
          </Alert>
        )}
      </Paper>

      {/* Dialog Nạp tiền */}
      <Dialog open={isDepositDialogOpen} onClose={handleCloseDepositDialog}>
        <DialogTitle>Nạp tiền vào tài khoản</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Số tiền"
            type="number"
            fullWidth
            variant="outlined"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
            }}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            select
            margin="dense"
            id="paymentMethod"
            label="Phương thức thanh toán"
            fullWidth
            variant="outlined"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="0">Tiền mặt</MenuItem>
            <MenuItem value="1">Thẻ tín dụng</MenuItem>
            <MenuItem value="2">Thẻ ghi nợ</MenuItem>
            <MenuItem value="3">Ví điện tử</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            id="reference"
            label="Mã tham chiếu (nếu có)"
            fullWidth
            variant="outlined"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDepositDialog} disabled={isDepositing}>
            Hủy bỏ
          </Button>
          <Button
            onClick={handleDeposit}
            variant="contained"
            disabled={
              isDepositing || !depositAmount || parseFloat(depositAmount) <= 0
            }
          >
            {isDepositing ? "Đang xử lý..." : "Nạp tiền"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Rút tiền */}
      <Dialog open={isWithdrawDialogOpen} onClose={handleCloseWithdrawDialog}>
        <DialogTitle>Rút tiền từ tài khoản</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Số tiền"
            type="number"
            fullWidth
            variant="outlined"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
            }}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            id="reason"
            label="Lý do rút tiền"
            fullWidth
            variant="outlined"
            value={withdrawReason}
            onChange={(e) => setWithdrawReason(e.target.value)}
            multiline
            rows={2}
          />
          {accountInfo && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Số dư hiện tại: {accountInfo.balance.toLocaleString("vi-VN")} VNĐ
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWithdrawDialog} disabled={isWithdrawing}>
            Hủy bỏ
          </Button>
          <Button
            onClick={handleWithdraw}
            variant="contained"
            color="primary"
            disabled={
              isWithdrawing ||
              !withdrawAmount ||
              parseFloat(withdrawAmount) <= 0 ||
              (accountInfo && parseFloat(withdrawAmount) > accountInfo.balance)
            }
          >
            {isWithdrawing ? "Đang xử lý..." : "Rút tiền"}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

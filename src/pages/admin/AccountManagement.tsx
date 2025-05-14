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
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogActions,
  // TextField,
  Tabs,
  Tab,
} from "@mui/material";
import { AdminLayout } from "../../components/layout/AdminLayout";
import accountService from "../../services/accountService";
import { AccountDTO, TransactionDTO } from "../../types/dto";

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
  // const [openDialog, setOpenDialog] = useState(false);
  // const [selectedAccount, setSelectedAccount] = useState<AccountDTO | null>(
  //   null
  // );
  // const [dialogType, setDialogType] = useState<"deposit" | "withdraw">(
  //   "deposit"
  // );
  // const [amount, setAmount] = useState<number>(0);
  // const [reason, setReason] = useState("");
  // const [paymentMethod, setPaymentMethod] = useState<number>(0);
  // const [referenceNumber, setReferenceNumber] = useState("");
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [selectedAccountDetails, setSelectedAccountDetails] =
    useState<AccountDTO | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      try {
        const accountsResponse = await accountService.getAllAccounts();
        if (accountsResponse.success) {
          setAccounts(accountsResponse.data);
          setError(null);
        } else {
          setError(
            accountsResponse.message || "Không thể tải danh sách tài khoản"
          );
        }
      } catch {
        setError(null);
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

  // const handleOpenDialog = (
  //   type: "deposit" | "withdraw",
  //   account: AccountDTO
  // ) => {
  //   setDialogType(type);
  //   setSelectedAccount(account);
  //   setAmount(0);
  //   setReason("");
  //   setPaymentMethod(0);
  //   setReferenceNumber("");
  //   setOpenDialog(true);
  // };

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  // };

  // const handleConfirm = async () => {
  //   if (!selectedAccount) return;

  //   try {
  //     if (dialogType === "deposit") {
  //       const depositData: DepositDTO = {
  //         accountId: selectedAccount.id,
  //         amount,
  //         paymentMethod,
  //         referenceNumber: referenceNumber || undefined,
  //       };
  //       await accountService.deposit(depositData);
  //     } else {
  //       await accountService.withdraw({
  //         accountId: selectedAccount.id,
  //         amount,
  //         reason: reason || undefined,
  //       });
  //     }

  //     // Refresh data after successful operation
  //     fetchData();
  //     handleCloseDialog();
  //   } catch (err) {
  //     console.error("Lỗi khi thực hiện giao dịch:", err);
  //     setError("Đã xảy ra lỗi khi thực hiện giao dịch");
  //   }
  // };

  const handleViewTransactions = async (account: AccountDTO) => {
    try {
      setSelectedAccountDetails(account);
      setTabValue(1);

      const response = await accountService.getTransactionsByAccountId(
        account.id
      );
      if (response.success) {
        setTransactions(response.data);
      } else {
        setError(response.message || "Không thể tải lịch sử giao dịch");
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử giao dịch:", err);
      setError("Đã xảy ra lỗi khi tải lịch sử giao dịch");
    }
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setSelectedAccountDetails(null);
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

  const getPaymentMethodText = (method?: number) => {
    if (method === undefined) return "Không xác định";
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
                    <TableCell>Số giờ</TableCell>
                    {/* <TableCell>Lần nạp cuối</TableCell> */}
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
                        {account.balance.toLocaleString("vi-VN")}
                      </TableCell>
                      {/* <TableCell>
                        {new Date(account.lastDepositDate).toLocaleString(
                          "vi-VN"
                        )}
                      </TableCell> */}
                      <TableCell>
                        {new Date(account.lastUsageDate).toLocaleString(
                          "vi-VN"
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {/* <Button
                            size="small"
                            color="primary"
                            variant="outlined"
                            onClick={() => handleOpenDialog("deposit", account)}
                          >
                            Nạp tiền
                          </Button>
                          <Button
                            size="small"
                            color="warning"
                            variant="outlined"
                            onClick={() =>
                              handleOpenDialog("withdraw", account)
                            }
                          >
                            Rút tiền
                          </Button> */}
                          <Button
                            size="small"
                            color="info"
                            variant="outlined"
                            onClick={() => handleViewTransactions(account)}
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
                  Số giờ{" "}
                  {selectedAccountDetails.balance.toLocaleString("vi-VN")} VNĐ
                </Typography>
              </Box>

              {transactions.length === 0 ? (
                <Typography>Không có giao dịch nào</Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã GD</TableCell>
                        <TableCell>Thời gian</TableCell>
                        <TableCell>Loại giao dịch</TableCell>
                        <TableCell>Số tiền (VNĐ)</TableCell>
                        <TableCell>Phương thức</TableCell>
                        <TableCell>Mô tả</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.id}</TableCell>
                          <TableCell>
                            {new Date(transaction.timestamp).toLocaleString(
                              "vi-VN"
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
                            }}
                          >
                            {transaction.amount.toLocaleString("vi-VN")}
                          </TableCell>
                          <TableCell>
                            {getPaymentMethodText(transaction.paymentMethod)}
                          </TableCell>
                          <TableCell>
                            {transaction.description || "-"}
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

      {/* Dialog for deposit/withdraw */}
      {/* <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogType === "deposit"
            ? "Nạp tiền vào tài khoản"
            : "Rút tiền từ tài khoản"}
        </DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Tài khoản: {selectedAccount.userName}
              </Typography>
              <Typography variant="subtitle2">
                Số giờ sử dụng:{" "}
                {selectedAccount.balance.toLocaleString("vi-VN")} VNĐ
              </Typography>
            </Box>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Số tiền (VNĐ)"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          {dialogType === "deposit" ? (
            <>
              <TextField
                margin="dense"
                label="Phương thức thanh toán"
                select
                fullWidth
                variant="outlined"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(Number(e.target.value))}
              >
                <option value={0}>Tiền mặt</option>
                <option value={1}>Thẻ tín dụng</option>
                <option value={2}>Thẻ ghi nợ</option>
                <option value={3}>Ví điện tử</option>
              </TextField>
              <TextField
                margin="dense"
                label="Mã tham chiếu (nếu có)"
                type="text"
                fullWidth
                variant="outlined"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
              />
            </>
          ) : (
            <TextField
              margin="dense"
              label="Lý do rút tiền"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color={dialogType === "deposit" ? "primary" : "warning"}
            disabled={amount <= 0}
          >
            {dialogType === "deposit" ? "Nạp tiền" : "Rút tiền"}
          </Button>
        </DialogActions> 
      </Dialog>*/}
    </AdminLayout>
  );
};

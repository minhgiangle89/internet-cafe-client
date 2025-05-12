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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import { AdminLayout } from "../../components/layout/AdminLayout";
import userService from "../../services/userService";
import accountService from "../../services/accountService";
import { UserDTO, CreateUserDTO, UpdateUserDTO } from "../../types/dto";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export const UserManagement = () => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"create" | "edit" | "status">(
    "create"
  );
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);

  const [formData, setFormData] = useState<CreateUserDTO>({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: new Date(),
    role: 0,
  });

  const [newStatus, setNewStatus] = useState<number>(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
        setError(null);
      } else {
        setError(response.message || "Không thể tải danh sách người dùng");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng:", err);
      setError("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = (
    type: "create" | "edit" | "status",
    user?: UserDTO
  ) => {
    setDialogType(type);

    if (type === "create") {
      setFormData({
        username: "",
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: new Date(),
        role: 1,
      });
      setSelectedUser(null);
    } else if (user) {
      setSelectedUser(user);

      if (type === "edit") {
        setFormData({
          username: user.username,
          email: user.email,
          password: "",
          fullName: user.fullName,
          phoneNumber: user.phoneNumber || "",
          address: user.address || "",
          dateOfBirth: new Date(user.dateOfBirth),
          role: user.role,
        });
      } else if (type === "status") {
        setNewStatus(user.status);
      }
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // const handleSelectChange = (e: SelectChangeEvent<number>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name as string]: value,
  //   }));
  // };
  const handleRoleChange = (e: SelectChangeEvent<number>) => {
    setFormData((prev) => ({
      ...prev,
      role: Number(e.target.value),
    }));
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: date,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (dialogType === "create") {
        await userService.createUser(formData);
      } else if (dialogType === "edit" && selectedUser) {
        const updateData: UpdateUserDTO = {
          email: formData.email,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth,
          role: formData.role,
        };
        await userService.updateUser(selectedUser.id, updateData);
      } else if (dialogType === "status" && selectedUser) {
        await userService.changeUserStatus(selectedUser.id, newStatus);
      }

      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      console.error("Lỗi khi thực hiện thao tác:", err);
      setError("Đã xảy ra lỗi khi thực hiện thao tác");
    }
  };

  const handleCreateAccount = async (userId: number) => {
    try {
      await accountService.createAccount(userId);
    } catch (err) {
      console.error("Lỗi khi tạo tài khoản:", err);
      setError("Đã xảy ra lỗi khi tạo tài khoản");
    }
  };

  const getUserRoleText = (role: number) => {
    switch (role) {
      case 1:
        return "Sinh Viên";
      case 2:
        return "Giáo Viên";
      default:
        return "Không xác định";
    }
  };

  const getUserStatusChip = (status: number) => {
    switch (status) {
      case 0:
        return <Chip label="Hoạt động" color="success" />;
      case 1:
        return <Chip label="Không hoạt động" color="default" />;
      case 2:
        return <Chip label="Bị khóa" color="error" />;
      default:
        return <Chip label="Không xác định" />;
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Quản lý sinh viên</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog("create")}
        >
          Thêm người dùng
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên đăng nhập</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getUserRoleText(user.role)}</TableCell>
                <TableCell>{getUserStatusChip(user.status)}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      onClick={() => handleOpenDialog("edit", user)}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      color="warning"
                      onClick={() => handleOpenDialog("status", user)}
                    >
                      Đổi trạng thái
                    </Button>
                    <Button
                      size="small"
                      color="info"
                      onClick={() => handleCreateAccount(user.id)}
                    >
                      Tạo tài khoản
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Create/Edit/Status */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {dialogType === "create"
              ? "Thêm người dùng mới"
              : dialogType === "edit"
              ? "Chỉnh sửa thông tin người dùng"
              : "Thay đổi trạng thái người dùng"}
          </DialogTitle>
          <DialogContent>
            {(dialogType === "create" || dialogType === "edit") && (
              <>
                <TextField
                  margin="dense"
                  name="username"
                  label="Tên đăng nhập"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={dialogType === "edit"} // Can't change username in edit mode
                />
                <TextField
                  margin="dense"
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {dialogType === "create" && (
                  <TextField
                    margin="dense"
                    name="password"
                    label="Mật khẩu"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                )}
                <TextField
                  margin="dense"
                  name="fullName"
                  label="Họ và tên"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="phoneNumber"
                  label="Số điện thoại"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="address"
                  label="Địa chỉ"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                <DatePicker
                  label="Ngày sinh"
                  value={formData.dateOfBirth}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: { fullWidth: true, margin: "dense" },
                  }}
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Vai trò</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    label="Vai trò"
                    onChange={handleRoleChange}
                  >
                    <MenuItem value={1}>Sinh Viên</MenuItem>
                    <MenuItem value={2}>Giáo Viên</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {dialogType === "status" && (
              <FormControl fullWidth margin="dense">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={newStatus}
                  label="Trạng thái"
                  onChange={(e) => setNewStatus(Number(e.target.value))}
                >
                  <MenuItem value={0}>Hoạt động</MenuItem>
                  <MenuItem value={1}>Không hoạt động</MenuItem>
                  <MenuItem value={2}>Bị khóa</MenuItem>
                </Select>
              </FormControl>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={handleSubmit} variant="contained">
              {dialogType === "create"
                ? "Thêm"
                : dialogType === "edit"
                ? "Lưu"
                : "Xác nhận"}
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </AdminLayout>
  );
};

import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import { AdminLayout } from "../../components/layout/AdminLayout";
import computerService from "../../services/computerService";
//import sessionService from "../../services/sessionService";
import {
  ComputerDTO,
  CreateComputerDTO,
  UpdateComputerDTO,
  ComputerStatusUpdateDTO,
} from "../../types/dto";

export const ComputerManagement = () => {
  const [computers, setComputers] = useState<ComputerDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<
    "create" | "edit" | "status" | "maintenance"
  >("create");
  const [selectedComputer, setSelectedComputer] = useState<ComputerDTO | null>(
    null
  );
  const [formData, setFormData] = useState<CreateComputerDTO>({
    name: "",
    ipAddress: "",
    specifications: "",
    location: "",
    hourlyRate: 0,
  });
  const [statusData, setStatusData] = useState<ComputerStatusUpdateDTO>({
    computerId: 0,
    status: 0,
    reason: "",
  });

  const fetchComputers = async () => {
    try {
      setLoading(true);
      const response = await computerService.getAllComputers();
      if (response.success) {
        setComputers(response.data);
        setError(null);
      } else {
        setError(response.message || "Không thể tải danh sách máy tính");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách máy tính:", err);
      setError("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComputers();
  }, []);

  const handleOpenDialog = (
    type: "create" | "edit" | "status" | "maintenance",
    computer?: ComputerDTO
  ) => {
    setDialogType(type);

    if (type === "create") {
      setFormData({
        name: "",
        ipAddress: "",
        specifications: "",
        location: "",
        hourlyRate: 0,
      });
      setSelectedComputer(null);
    } else if (computer) {
      setSelectedComputer(computer);

      if (type === "edit") {
        setFormData({
          name: computer.name,
          ipAddress: computer.ipAddress,
          specifications: computer.specifications,
          location: computer.location,
          hourlyRate: computer.hourlyRate,
        });
      } else if (type === "status" || type === "maintenance") {
        setStatusData({
          computerId: computer.id,
          status: type === "maintenance" ? 2 : 0, // 2 is maintenance status
          reason: "",
        });
      }
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setStatusData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (dialogType === "create" || dialogType === "edit") {
      setFormData((prev) => ({
        ...prev,
        [name as string]: value,
      }));
    } else {
      setStatusData((prev) => ({
        ...prev,
        [name as string]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (dialogType === "create") {
        await computerService.createComputer(formData);
      } else if (dialogType === "edit" && selectedComputer) {
        await computerService.updateComputer(
          selectedComputer.id,
          formData as UpdateComputerDTO
        );
      } else if (dialogType === "status" && selectedComputer) {
        await computerService.updateComputerStatus(
          selectedComputer.id,
          statusData
        );
      } else if (dialogType === "maintenance" && selectedComputer) {
        await computerService.setMaintenance(
          selectedComputer.id,
          statusData.reason || "Bảo trì định kỳ"
        );
      }

      fetchComputers();
      handleCloseDialog();
    } catch (err) {
      console.error("Lỗi khi thực hiện thao tác:", err);
      setError("Đã xảy ra lỗi khi thực hiện thao tác");
    }
  };

  const getStatusChip = (status: number) => {
    switch (status) {
      case 0:
        return <Chip label="Khả dụng" color="success" />;
      case 1:
        return <Chip label="Đang sử dụng" color="primary" />;
      case 2:
        return <Chip label="Bảo trì" color="warning" />;
      case 3:
        return <Chip label="Hỏng" color="error" />;
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
        <Typography variant="h4">Quản lý máy tính</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog("create")}
        >
          Thêm máy tính mới
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {computers.map((computer) => (
          <Grid
            sx={{ width: { xs: "100%", sm: "50%", md: "33.333%" } }}
            key={computer.id}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {computer.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    IP: {computer.ipAddress}
                  </Typography>
                  {getStatusChip(computer.computerStatus)}
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Vị trí: {computer.location}
                </Typography>
                {/* <Typography variant="body2">
                  Giá/giờ: {computer.hourlyRate.toLocaleString("vi-VN")} VNĐ
                </Typography> */}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleOpenDialog("edit", computer)}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  size="small"
                  onClick={() => handleOpenDialog("status", computer)}
                >
                  Đổi trạng thái
                </Button>
                <Button
                  size="small"
                  color="warning"
                  onClick={() => handleOpenDialog("maintenance", computer)}
                >
                  Bảo trì
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Create/Edit/Status */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogType === "create"
            ? "Thêm máy tính mới"
            : dialogType === "edit"
            ? "Chỉnh sửa máy tính"
            : dialogType === "maintenance"
            ? "Đặt máy tính vào chế độ bảo trì"
            : "Thay đổi trạng thái máy tính"}
        </DialogTitle>
        <DialogContent>
          {(dialogType === "create" || dialogType === "edit") && (
            <>
              <TextField
                margin="dense"
                name="name"
                label="Tên máy tính"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="ipAddress"
                label="Địa chỉ IP"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.ipAddress}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="specifications"
                label="Thông số kỹ thuật"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                value={formData.specifications}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="location"
                label="Vị trí"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.location}
                onChange={handleInputChange}
              />
              {/* <TextField
                margin="dense"
                name="hourlyRate"
                label="Giá/giờ (VNĐ)"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.hourlyRate}
                onChange={handleInputChange}
              /> */}
            </>
          )}

          {dialogType === "status" && (
            <FormControl fullWidth margin="dense">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={statusData.status}
                label="Trạng thái"
                onChange={handleSelectChange}
              >
                <MenuItem value={0}>Khả dụng</MenuItem>
                <MenuItem value={2}>Bảo trì</MenuItem>
                <MenuItem value={3}>Hỏng</MenuItem>
              </Select>
              <TextField
                margin="dense"
                name="reason"
                label="Lý do"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={2}
                value={statusData.reason}
                onChange={handleInputChange}
              />
            </FormControl>
          )}

          {dialogType === "maintenance" && (
            <TextField
              margin="dense"
              name="reason"
              label="Lý do bảo trì"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={statusData.reason}
              onChange={handleInputChange}
            />
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
    </AdminLayout>
  );
};

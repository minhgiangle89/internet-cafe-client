// src/pages/admin/SessionManagement.tsx
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
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { AdminLayout } from "../../components/layout/AdminLayout";
import sessionService from "../../services/sessionService";
import { SessionDTO } from "../../types/dto";
import { formatDuration } from "../../utils/formatters";

export const SessionManagement = () => {
  const [sessions, setSessions] = useState<SessionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionDTO | null>(
    null
  );
  const [terminateReason, setTerminateReason] = useState("");

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionService.getActiveSessions();
      if (response.success) {
        setSessions(response.data);
        setError(null);
      } else {
        setError(response.message || "Không thể tải danh sách phiên sử dụng");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách phiên sử dụng:", err);
      setError("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    // Thiết lập interval để cập nhật danh sách phiên mỗi 30 giây
    const interval = setInterval(() => {
      fetchSessions();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenTerminateDialog = (session: SessionDTO) => {
    setSelectedSession(session);
    setTerminateReason("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleTerminateSession = async () => {
    if (!selectedSession) return;

    try {
      const response = await sessionService.terminateSession(
        selectedSession.id,
        terminateReason
      );
      if (response.success) {
        fetchSessions();
      } else {
        setError(response.message || "Không thể chấm dứt phiên sử dụng");
      }
    } catch (err) {
      console.error("Lỗi khi chấm dứt phiên sử dụng:", err);
      setError("Đã xảy ra lỗi khi chấm dứt phiên sử dụng");
    } finally {
      handleCloseDialog();
    }
  };

  const getSessionStatusChip = (status: number) => {
    switch (status) {
      case 0:
        return <Chip label="Đang hoạt động" color="success" />;
      case 1:
        return <Chip label="Hoàn thành" color="default" />;
      case 2:
        return <Chip label="Đã chấm dứt" color="error" />;
      case 3:
        return <Chip label="Hết thời gian" color="warning" />;
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Quản lý phiên sử dụng</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Danh sách phiên đang hoạt động
        </Typography>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {sessions.length === 0 ? (
        <Typography>Không có phiên đang hoạt động</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã phiên</TableCell>
                <TableCell>Người dùng</TableCell>
                <TableCell>Máy tính</TableCell>
                <TableCell>Bắt đầu</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Chi phí hiện tại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.id}</TableCell>
                  <TableCell>{session.userName}</TableCell>
                  <TableCell>{session.computerName}</TableCell>
                  <TableCell>
                    {new Date(session.startTime).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>{formatDuration(session.duration)}</TableCell>
                  <TableCell>
                    {session.totalCost.toLocaleString("vi-VN")} VNĐ
                  </TableCell>
                  <TableCell>{getSessionStatusChip(session.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => handleOpenTerminateDialog(session)}
                    >
                      Chấm dứt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog chấm dứt phiên */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Chấm dứt phiên sử dụng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn chấm dứt phiên sử dụng này?
            {selectedSession && (
              <Box component="span" sx={{ display: "block", mt: 1 }}>
                Người dùng: {selectedSession.userName} <br />
                Máy tính: {selectedSession.computerName}
              </Box>
            )}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="reason"
            label="Lý do chấm dứt"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={terminateReason}
            onChange={(e) => setTerminateReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleTerminateSession}
            color="error"
            variant="contained"
          >
            Chấm dứt
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

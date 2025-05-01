import React, { useState } from "react";
import {
  Typography,
  Container,
  Box,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
  });

  const handleError = (error: Error) => {
    setErrorState({ hasError: true, error });
    // Optionally log the error to a service
    console.error("Caught error:", error);
  };

  const resetError = () => {
    setErrorState({ hasError: false });
  };

  if (errorState.hasError) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Card sx={{ width: "100%", maxWidth: 400 }}>
            <CardContent>
              <Typography variant="h4" color="error" gutterBottom>
                Đã xảy ra lỗi
              </Typography>
              <Typography variant="body1" gutterBottom>
                Chúng tôi rất tiếc, một lỗi không mong muốn đã xảy ra.
              </Typography>
              {errorState.error && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 2,
                    p: 1,
                    bgcolor: "rgba(255,0,0,0.1)",
                    borderRadius: 1,
                  }}
                >
                  {errorState.error.message}
                </Typography>
              )}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/"
                >
                  Quay về Trang chủ
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={resetError}
                >
                  Thử lại
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  try {
    return <>{children}</>;
  } catch (error) {
    handleError(error as Error);
    return null;
  }
};

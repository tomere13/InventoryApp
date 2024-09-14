import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { IReport } from "../types";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const ReportDetail: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<IReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) {
      setError("Invalid report ID.");
      setLoading(false);
      return;
    }

    axios
      .get<{ report: IReport }>(`/api/reports/${reportId}`)
      .then((response) => {
        console.log("Fetched Report Detail:", response.data.report);
        setReport(response.data.report);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching report detail:", err);
        setError("Failed to load report details.");
        setLoading(false);
      });
  }, [reportId]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, direction: "rtl" }}>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, direction: "rtl" }}>
        <Alert severity="error" sx={{ textAlign: "right" }}>
          {error}
        </Alert>
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            component={RouterLink}
            to="/reportspage"
          >
            חזרה לרשימת הדוחות
          </Button>
        </Box>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, direction: "rtl" }}>
        <Alert severity="info" sx={{ textAlign: "right" }}>
          הדוח לא נמצא.
        </Alert>
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            component={RouterLink}
            to="/reportspage"
          >
            חזרה לרשימת הדוחות
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, direction: "rtl" }}>
      <Box sx={{ mb: 2, textAlign: "right" }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          component={RouterLink}
          to="/reportspage"
        >
          חזרה לרשימת הדוחות
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom sx={{ textAlign: "right" }}>
        פרטי הדוח
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ textAlign: "right" }}>
          <strong>סניף:</strong> {report.branchId?.name || "N/A"}
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: "right" }}>
          <strong>תאריך נשלח:</strong>{" "}
          {new Date(report.dateSent).toLocaleDateString("he-IL", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
        <Typography variant="subtitle1" sx={{ textAlign: "right" }}>
          <strong>הערות:</strong> {report.notes || "אין הערות"}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom sx={{ textAlign: "right" }}>
        פרטי דוח הזמנת מלאי:
      </Typography>

      {report.stockReport.length > 0 ? (
        report.stockReport.map((it, index) => (
          <Card key={index} sx={{ mb: 2, textAlign: "right" }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                <strong>שם מוצר:</strong> {it.itemId?.name || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>תיאור:</strong> {it.itemId?.description || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>מחיר:</strong> ₪{it.itemId?.price || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>מלאי להזמנה:</strong> {it.currentStock}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="subtitle1" sx={{ textAlign: "right" }}>
          אין פריטים לדוח מלאי.
        </Typography>
      )}
    </Container>
  );
};

export default ReportDetail;
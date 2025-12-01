import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import ProductList from "../components/ProductList";
import { getSummary } from "../api";

export function Dashboard() {
  const [summary, setSummary] = useState({ total: 0, value: 0 });

  // Optionally compute inventory summary
  useEffect(() => {

    const fetchSummary = async () => {
      try {
        const data = await getSummary();
        setSummary({
          total: data.total_count ?? 0,
          value: data.total_value ?? 0,
        });
      } catch (err) {
        console.error("Failed to load summary:", err);
      }
    };
    fetchSummary();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom>Hello</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2, textAlign: "center" }}>
            <Typography variant="h6">Total Products</Typography>
            <Typography variant="h4">{summary.total}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2, textAlign: "center" }}>
            <Typography variant="h6">Total Inventory Value</Typography>
            <Typography variant="h4">₹{summary.value}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* <ProductList /> */}
    </Box>
  );
}

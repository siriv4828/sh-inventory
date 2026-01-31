import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Card, CardContent,useTheme,useMediaQuery } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import axios from "axios";
import { API_URL } from "../api";

export function Home() {
  const [summary, setSummary] = useState({ total: 0, value: 0 });
  const [graphData, setGraphData] = useState([]);
  const [line_graphData, setLine_graphData] = useState([]);
    const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const [products, setProducts] = useState([]);

  // Optionally compute inventory summary
  useEffect(() => {
    loadSummary();
    loadGraphData();
    loadLineGraphData();
  }, []);

  const loadSummary = async () => {
    const res = await axios.get(`${API_URL}/summary`);
    console.log("summary",res.data);
    setSummary({
      total: res.data.total_quantity,
      value: res.data.total_value
    });
  }

  const loadGraphData = async () => {
    const res = await axios.get(`${API_URL}/bargraph`);
    setGraphData(res.data);
    console.log("res",res.data);
  }

  const loadLineGraphData = async () => {
    await axios.get(`${API_URL}/linegraph`).then((res) => {
      const raw = res.data;

      // Prepare line/bar chart data
      const grouped = {};
      raw.forEach((i) => {
        if (!grouped[i.month]) grouped[i.month] = { month: i.month };
        grouped[i.month][i.product] = i.quantity;
      });
      const finalData = Object.values(grouped);
      console.log(finalData);
      setLine_graphData(finalData);
    });
  }

  const products = Array.from(
    new Set(line_graphData.flatMap((d) => Object.keys(d).filter((k) => k !== "month")))
  );
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Dashboard
      </Typography>
      {/* <Grid container spacing={2} sx={{ mb: 3 }}> */}
      <Box sx={{ display: "flex", alignContent: "center", justifyContent: "space-around", flexWrap: "wrap", gap: 2 }}>
        {/* <Grid item xs={12} md={6} lg={4} sx={{ mb: 2, mr: 2 }}> */}
          <Paper sx={{ padding: 2, textAlign: "center" }}>
            <Typography variant="body1" >Total Products</Typography>
            <Typography variant="body1" fontWeight="bold">{summary.total}</Typography>
          </Paper>
        {/* </Grid> */}

        {/* <Grid item xs={12} md={6}lg={4} sx={{ mb: 2, mr: 2 }}> */}
          <Paper sx={{ padding: 2, textAlign: "center" }}>
            <Typography variant="body1" >Total Inventory Value</Typography>
            <Typography variant="body1" fontWeight="bold">₹{summary.value}</Typography>
          </Paper>
           <Paper sx={{ padding: 2, textAlign: "center" }}>
            <Typography variant="body1" >Total Inventory Value</Typography>
            <Typography variant="body1" fontWeight="bold">₹{summary.value}</Typography>
          </Paper>
           <Paper sx={{ padding: 2, textAlign: "center" }}>
            <Typography variant="body1" >Total Inventory Value</Typography>
            <Typography variant="body1" fontWeight="bold">₹{summary.value}</Typography>
          </Paper>
        {/* </Grid> */}
        </Box>
      {/* </Grid> */}
      {/* <Grid container spacing={2} mt={2}> */}
        {/* LINE CHART */}
        {/* <Grid item xs={12} md={12} lg={6} xl={6}> */}
           <Box sx={{ display: "flex", alignContent: "center", flexDirection: isMobile ? "column" : "row", gap: 2,mt:2 }}>
            {/* <Grid item xs={12} md={12} lg={6} xl={6}> */}
          <Card sx={{ mb: 2, width: '90%' }}>
            <CardContent>
              <Typography>Product Quantity Bar Graph</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        {/* </Grid> */}

        {/* BAR CHART */}
        {/* <Grid item xs={12} md={12} lg={6} xl={6}> */}
          <Card sx={{ mb: 2, width: '90%' }}>
            <CardContent>
              <Typography>Monthly Sales Trend</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={line_graphData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {products.map((p) => (
                    <Line key={p} dataKey={p} strokeWidth={2} dot={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        {/* </Grid> */}
      {/* </Grid> */}
      </Box>
    </Box>
  );
};
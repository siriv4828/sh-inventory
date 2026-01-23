import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
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
  const[graphData,setGraphData] =useState([]);
  const [line_graphData,setLine_graphData] = useState([]);

  // Optionally compute inventory summary
  useEffect(() => {
loadSummary();  
loadGraphData();
loadLineGraphData();
  }, []);

 const loadSummary=async()=>{
   const res = await axios.get(`${API_URL}/summary`);
    setSummary({
      total: res.data.total_quantity,
      value: res.data.total_value
    });
  }

const loadGraphData=async()=>{
const res = await axios.get(`${API_URL}/bargraph`);
setGraphData(res.data);
}

const loadLineGraphData=async()=>{
  axios.get("/linegraph").then((res) => {
      const raw = res.data;

      // convert to recharts format
      const grouped = {};
      raw.forEach((r) => {
        if (!grouped[r.month]) grouped[r.month] = { month: r.month };
        grouped[r.month][r.product] = r.quantity;
      });

      setLine_graphData(Object.values(grouped));
    });
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
       Dashboard
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6 }>
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
      <Paper sx={{ p: 2, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Product Quantity Bar Graph
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" />
        </BarChart>
      </ResponsiveContainer>
       <ResponsiveContainer width="100%" height={350}>
      <LineChart data={line_graphData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey="Fan" strokeWidth={2} />
        <Line type="monotone" dataKey="Bulb" strokeWidth={2} />
        <Line type="monotone" dataKey="Switch" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
    </Paper>
</Box>
  );
}
};
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
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);

  // Optionally compute inventory summary
  useEffect(() => {
    loadSummary();
    loadGraphData();
    loadLineGraphData();
    loadOrders();
    loadSales();
  }, []);

   const loadSales = async () => {
    const res = await axios.get(`${API_URL}/sales`);
    setSales(res.data);
  };

   const loadOrders = async () => {
    const res = await fetch(`${API_URL}/purchase-orders`);
    setOrders(await res.json());
  };

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

  const orderedCount = orders.filter(
  (order) => order.status === "ordered"
).length;

const pendingCount = orders.filter(
  (order) => order.status === "pending"
).length;

 const dispatchedCount = orders.filter(
  (order) => order.status === "dispatched"
).length;

const shippedCount = orders.filter(
  (order) => order.status === "shipped"
).length;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ display: "flex", alignContent: "center", justifyContent: "space-around", flexWrap: "wrap", gap: 2 }}>
          <Paper sx={{ padding: 2, textAlign: "center" }}>
            <Typography variant="body1" >Total Products</Typography>
            <Typography variant="body1" fontWeight="bold">{summary.total}</Typography>
          </Paper>  

          <Paper sx={{ padding: 2, textAlign: "center" }}>            
            <Typography variant="body1" >Total Inventory Value</Typography>
            <Typography variant="body1" fontWeight="bold">₹{summary.value}</Typography>
          </Paper>
           <Paper sx={{ padding: 2, textAlign: "center" }}>
            <Box sx={{display:'flex',flexDirection:'row',gap:2,alignItems:'space-between'}}>
            <Typography variant="body1" >Ordered Products</Typography>
            <Typography variant="body1" fontWeight="bold">{orderedCount}</Typography></Box>
             <Box sx={{display:'flex',flexDirection:'row',gap:2,justifyContent:'space-between'}}>
               <Typography variant="body1" >Pending Products</Typography>
            <Typography variant="body1" fontWeight="bold">{pendingCount}</Typography>
             </Box>
          </Paper>
           <Paper sx={{ padding: 2, textAlign: "center" }}>
            <Box sx={{display:'flex',flexDirection:'row',gap:2,alignItems:'space-between'}}>
            <Typography variant="body1" >Dispatched Products</Typography>
            <Typography variant="body1" fontWeight="bold">{dispatchedCount}</Typography></Box>
             <Box sx={{display:'flex',flexDirection:'row',gap:2,justifyContent:'space-between'}}>
               <Typography variant="body1" >Shipped Products</Typography>
            <Typography variant="body1" fontWeight="bold">{shippedCount}</Typography>
             </Box>
          </Paper>    
        </Box>
    
        {/* LINE CHART */}
           <Box sx={{ display: "flex", alignContent: "center", flexDirection: isMobile ? "column" : "row", gap: 2,mt:2 }}>
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

        {/* BAR CHART */}
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
      </Box>
    </Box>
  );
};
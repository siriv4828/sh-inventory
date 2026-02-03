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

const MONTH_ORDER = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

  const COLORS = [
  "#7CB342",
  "#F57C00",
  "#42A5F5",
  "#AB47BC",
  "#EF5350",
];

export function Home() {
  const [summary, setSummary] = useState({ total: 0, value: 0 });
  const [graphData, setGraphData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Optionally compute inventory summary
  useEffect(() => {
    loadSummary();
    loadGraphData();
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
    setSummary({
      total: res.data.total_quantity,
      value: res.data.total_value
    });
  }

  const loadGraphData = async () => {
    const res = await axios.get(`${API_URL}/bargraph`);
    setGraphData(res.data);
  }

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

const transformSalesForChart = (sales) => {
  const monthMap = {};
  const productSet = new Set();

  sales.forEach((s) => {
    const month = new Date(s.order_date).toLocaleString("en-US", {
      month: "short",
    });

    const product = s.product_name.trim();
    productSet.add(product);

    if (!monthMap[month]) {
      monthMap[month] = { month };
    }

    monthMap[month][product] =
      (monthMap[month][product] || 0) + s.quantity;
  });

  // 👉 Fill missing products with 0
  Object.values(monthMap).forEach((row) => {
    productSet.forEach((p) => {
      if (row[p] === undefined) row[p] = 0;
    });
  });

  // 👉 Sort months correctly
  const chartData = Object.values(monthMap).sort(
    (a, b) =>
      MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month)
  );

  return {
    chartData,
    products: Array.from(productSet),
  };
};
const{ chartData, products }= transformSalesForChart(sales);

return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ display: "flex", alignContent: "center", justifyContent: "space-around", flexWrap: "wrap", gap: 2 }}>
          <Paper sx={{ padding: 2, textAlign: "center" }}>
            <Typography >Total Products</Typography>
            <Typography fontWeight="bold">{summary.total}</Typography>
          </Paper>  

          <Paper sx={{ padding: 2, textAlign: "center" }}>            
            <Typography >Total Inventory Value</Typography>
            <Typography fontWeight="bold">₹{summary.value}</Typography>
          </Paper>
           <Paper sx={{ padding: 2, textAlign: "center" }}>
            <Box sx={{display:'flex',flexDirection:'row',gap:2,alignItems:'space-between'}}>
            <Typography>Ordered Products</Typography>
            <Typography fontWeight="bold">{orderedCount}</Typography></Box>
             <Box sx={{display:'flex',flexDirection:'row',gap:2,justifyContent:'space-between'}}>
               <Typography >Pending Products</Typography>
            <Typography fontWeight="bold">{pendingCount}</Typography>
             </Box>
          </Paper>
           <Paper sx={{ padding: 2, textAlign: "center" }}>
            <Box sx={{display:'flex',flexDirection:'row',gap:2,alignItems:'space-between'}}>
            <Typography >Dispatched Products</Typography>
            <Typography fontWeight="bold">{dispatchedCount}</Typography></Box>
             <Box sx={{display:'flex',flexDirection:'row',gap:2,justifyContent:'space-between'}}>
               <Typography >Shipped Products</Typography>
            <Typography fontWeight="bold">{shippedCount}</Typography>
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
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />

        {products.map((product, index) => (
          <Line
            key={product}
            type="monotone"
            dataKey={product}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={3}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
            </CardContent>
          </Card>
      </Box>
    </Box>
  );
};
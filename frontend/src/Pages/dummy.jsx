import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import { API_URL } from "../api";

export default function SalesDashboard() {
  const [chartData, setChartData] = useState([]);
  const [kpi, setKpi] = useState({ total: 0, orders: 0, products: 0 });

  useEffect(() => {
    axios.get(`${API_URL}/linegraph`).then((res) => {
      const raw = res.data;

      // Prepare line/bar chart data
      const grouped = {};
      raw.forEach((i) => {
        if (!grouped[i.month]) grouped[i.month] = { month: i.month };
        grouped[i.month][i.product] = i.quantity;
      });
      const finalData = Object.values(grouped);
      setChartData(finalData);

      // KPI
      const totalQty = raw.reduce((a, b) => a + b.quantity, 0);
      setKpi({
        total: totalQty,
        orders: raw.length,
        products: new Set(raw.map((r) => r.product)).size,
      });
    });
  }, []);

  const products = Array.from(
    new Set(chartData.flatMap((d) => Object.keys(d).filter((k) => k !== "month")))
  );

  const pieData = products.map((p) => ({
    name: p,
    value: chartData.reduce((sum, m) => sum + (m[p] || 0), 0),
  }));

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>Sales Dashboard</Typography>

      {/* KPI CARDS */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <KpiCard title="Total Sales" value={kpi.total} icon={<TrendingUpIcon />} />
        </Grid>
        <Grid item xs={12} md={4}>
          <KpiCard title="Orders" value={kpi.orders} icon={<ShoppingCartIcon />} />
        </Grid>
        <Grid item xs={12} md={4}>
          <KpiCard title="Products" value={kpi.products} icon={<InventoryIcon />} />
        </Grid>
</Grid>
        <Grid container spacing={2} mt={2}>
        {/* LINE CHART */}
        <Grid item xs={12} md={8}lg={6}>
          <Card>
            <CardContent>
              <Typography>Monthly Sales Trend</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
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
        </Grid>

        {/* PIE CHART */}
        {/* <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Sales Share</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid> */}

        {/* BAR CHART */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography>Product Comparison</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {products.map((p) => (
                    <Bar key={p} dataKey={p} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function KpiCard({ title, value, icon }) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="body2">{title}</Typography>
            <Typography variant="h6">{value}</Typography>
          </div>
          {icon}
        </Box>
      </CardContent>
    </Card>
  );
}

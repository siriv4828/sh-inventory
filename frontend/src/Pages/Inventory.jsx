import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, CircularProgress, Button } from "@mui/material";
import { getProducts } from "../api";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Products & Quantities</Typography>
<Button variant="outlined"sx={{ mt: 2,backgroundColor:"#003135",color:"ButtonShadow"}} onClick={fetchProducts} disabled={loading}>
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography>No products found.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {products.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <Paper sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography >{p.name}s</Typography><br/>
                <Typography sx={{ fontWeight: 600 }}>{Number(p.quantity || 0)}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
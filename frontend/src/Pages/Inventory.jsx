import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Grid, Box
} from "@mui/material";
import { API_URL } from "../api";

const getStock = (qty) => {
  if (qty === 0) return { label: "LOW", color: "error" };
  if (qty <= 10) return { label: "MEDIUM", color: "warning" };
  return { label: "HIGH", color: "success" };
};

export default function ProductCards() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/products`).then((res) => setProducts(res.data));
    console.log(products);
  }, []);

  return (
    <Grid container spacing={3} padding={3}>
      {console.log(products)}
      {products.map((p) => {
        const stock = getStock(p.quantity);

        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: 3,
                position: "relative",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.03)" }
              }}
            >
              {/* <CardMedia
                component="img"
                image={p.image}
                alt={p.name}
                sx={{
                  height: 180,
                  width: "100%",
                  objectFit: "cover",
                  backgroundColor: "#f5f5f5"
                }}
              /> */}
              <Box
                sx={{
                  height: 180,
                  width: "100%",
                  overflow: "hidden",
                  backgroundColor: "#f5f5f5"
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#fff",
                  backgroundColor:
                    stock.color === "error"
                      ? "#d32f2f"
                      : stock.color === "warning"
                        ? "#ed6c02"
                        : "#2e7d32",
                  boxShadow: 2,
                }}
              >
                {stock.label}
              </Box>

              <CardContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography color="text.secondary">
                  ₹ {p.price}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  Quantity: <b>{p.quantity}</b>
                </Typography>

                {/* <Chip
                  label={stock.label}
                  color={stock.color}
                  sx={{ mt: 1 }}
                /> */}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

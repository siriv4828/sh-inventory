import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { addProduct } from "../api";

export default function AddProductForm() {
  const [form, setForm] = useState({ name: "", quantity: "", price: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(form);
    try {
      await addProduct({
        name: form.name,
        quantity: parseFloat(form.quantity),
        price: parseFloat(form.price),
      });
      alert("✅ Product added successfully!");
      setForm({ name: "", quantity: "", price: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product");
    }
    setLoading(false);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
         Add New Product
      </Typography>
      <Box component="form"
       onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Product Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <TextField
          label="Price (₹)"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, backgroundColor: "#003135" }}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </Button>
      </Box>
    </Paper>
  );
}

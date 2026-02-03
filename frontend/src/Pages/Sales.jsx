import React, { useEffect, useState, useContext } from "react";
import {
  Box, Button, Paper, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Grid
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { SnackContext } from "../context/UserContext";
import axios from "axios";
import { API_URL } from "../api";

export function Sales() {
  const { setSnack } = useContext(SnackContext);
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    product_id: "",
    quantity: "",
    status: "ordered"
  });

  const loadSales = async () => {
    const res = await axios.get(`${API_URL}/sales`);
    setSales(res.data);
  };

  const loadProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    setProducts(await res.json());
  };

  useEffect(() => {
    loadSales();
    loadProducts();
  }, [sales]);

  const handleAdd = async () => {
    if (!form.customer_name || !form.email || !form.product_id || !form.quantity) {
      setSnack({
        message: "Please fill all fields",
        color: "red",
        type: "error",
        open: true,
      });
      return;
    }

    const data = new FormData();
    data.append("customer_name", form.customer_name);
    data.append("email", form.email);
    data.append("product_id", form.product_id);
    data.append("quantity", form.quantity);
    data.append("status", form.status);

    axios.post(`${API_URL}/sales`, data)
    setOpenAdd(false)
    setSnack({
      message: "Sales Order Added Successfully",
      color: "green",
      type: "success",
      open: true,
    });
    loadSales();

  };

  const handleEdit = async () => {
    await axios.put(
      `${API_URL}/sales/${selected.id}?status=${form.status}`
    );
    setOpenEdit(false);
    loadSales();
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Sales Orders</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
        >
          Add Sales Order
        </Button>
      </Box>

      {/* Sales list */}
      <Grid container spacing={2}>
        {sales.map(s => (
          <Box key={s.id} mb={2} width="100%" display="inline">
            <Paper sx={{ p: 2, position: "relative" }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Grid item xs={12} md={6} lg={6} alignContent="space-between">
                  <Typography>
                    <b>{s.customer_name} - {s.email}</b>
                  </Typography>
                  <IconButton
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={() => {
                      setSelected(s);
                      setForm({ status: s.status });
                      setOpenEdit(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <Typography>
                    {s.quantity}{"  "}{s.product_name}
                  </Typography>
                  <Typography>
                    <b>{s.status}</b>
                  </Typography>
                </Grid>
              </Box>
            </Paper>
          </Box>
        ))}
      </Grid>

      {/* Add Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth>
        <DialogTitle>Add Sales Order</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Customer Name" margin="dense"
            onChange={e => setForm({ ...form, customer_name: e.target.value })} />

          <TextField fullWidth label="Email" margin="dense"
            onChange={e => setForm({ ...form, email: e.target.value })} />

          <TextField select fullWidth label="Product Name" margin="dense"
            onChange={e => setForm({ ...form, product_id: e.target.value })} >
            {products.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.name} (ID: {p.id})</MenuItem>
            ))}
          </TextField>

          <TextField fullWidth label="Quantity" type="number" margin="dense"
            onChange={e => setForm({ ...form, quantity: e.target.value })} />

          <TextField select fullWidth label="Status" margin="dense"
            onChange={e => setForm({ ...form, status: e.target.value })}>
            <MenuItem value="dispatched">Dispatched</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}><Typography color="#003135">cancel</Typography></Button>
          <Button variant="contained" sx={{ backgroundColor: "#003135" }} onClick={handleAdd}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog (status only) */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box mr={6} ml={6}>
          <DialogTitle>Update Status</DialogTitle>
          <DialogContent>

            <TextField
              select
              fullWidth
              label="Status"
              value={form.status}
              onChange={e => setForm({ status: e.target.value })}
            >
              <MenuItem value="dispatched">Dispatched</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}><Typography color="#003135">Cancel</Typography></Button>
            <Button variant="contained" sx={{ backgroundColor: "#003135" }} onClick={handleEdit}>Update</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

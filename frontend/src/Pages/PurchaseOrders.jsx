import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Select, Box, IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

/* Dummy data */
const suppliers = [
  { id: 1, name: "ABC Electronics" },
  { id: 2, name: "Bright Supplies" },
  { id: 3, name: "Smart Traders" },
];

const products = [
  { id: 101, name: "LED TV" },
  { id: 102, name: "Washing Machine" },
  { id: 103, name: "Refrigerator" },
];

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [form, setForm] = useState({
    supplier: "",
    product: "",
    quantity: "",
    status: "ordered",
  });

  const openAdd = () => {
    setEditIndex(null);
    setForm({ supplier: "", product: "", quantity: "", status: "ordered" });
    setOpen(true);
  };

  const openEdit = (i) => {
    setEditIndex(i);
    setForm(orders[i]);
    setOpen(true);
  };

  const saveOrder = () => {
    if (editIndex !== null) {
      const copy = [...orders];
      copy[editIndex] = form;
      setOrders(copy);
    } else {
      setOrders([...orders, form]);
    }
    setOpen(false);
  };

  return (
    <Box p={3}>
      <Button
        variant="contained"
        sx={{ float: "right", mb: 2 }}
        onClick={openAdd}
      >
        + Place Order
      </Button>

      <h2>Purchase Orders</h2>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Supplier</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Edit</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders.map((o, i) => (
            <TableRow key={i}>
              <TableCell>{o.supplier}</TableCell>
              <TableCell>{o.product}</TableCell>
              <TableCell>{o.quantity}</TableCell>
              <TableCell>{o.status}</TableCell>
              <TableCell>
                <IconButton onClick={() => openEdit(i)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {editIndex !== null ? "Edit Order" : "Place Order"}
        </DialogTitle>

        <DialogContent>
          <Select
            fullWidth
            value={form.supplier}
            displayEmpty
            onChange={(e) => setForm({ ...form, supplier: e.target.value })}
            sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>Select Supplier</MenuItem>
            {suppliers.map((s) => (
              <MenuItem key={s.id} value={s.name}>
                {s.name}
              </MenuItem>
            ))}
          </Select>

          <Select
            fullWidth
            value={form.product}
            displayEmpty
            onChange={(e) => setForm({ ...form, product: e.target.value })}
            sx={{ mt: 2 }}
          >
            <MenuItem value="" disabled>Select Product</MenuItem>
            {products.map((p) => (
              <MenuItem key={p.id} value={`${p.id} - ${p.name}`}>
                {p.id} - {p.name}
              </MenuItem>
            ))}
          </Select>

          <TextField
            label="Quantity"
            type="number"
            fullWidth
            sx={{ mt: 2 }}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />

          <Select
            fullWidth
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            sx={{ mt: 2 }}
          >
            <MenuItem value="ordered">Ordered</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
          </Select>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveOrder}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

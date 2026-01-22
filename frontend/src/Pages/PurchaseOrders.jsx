import { useEffect, useState,useContext } from "react";
import {
  Box, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { API_URL } from "../api";
import { SnackContext } from "../context/UserContext";
import axios from "axios";

const API = API_URL;

export default function PurchaseOrdersPage() {
   const {setSnack}=useContext(SnackContext);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [add_open, setAdd_Open] = useState(false);
  const [edit_open, setEdit_Open] = useState(false);
  const [id, setId] = useState(null);
  // const isEdit = Boolean(editing);

const suppliers = [
  { id: 1, name: "ABC Electronics" },
  { id: 2, name: "Bright Supplies" },
  { id: 3, name: "Smart Traders" },
  { id: 4, name: "Global Tech" },
  { id: 5, name: "NextGen Distributors" },
];

  const [form, setForm] = useState({
    supplier_name: "",
    product_id: "",
    quantity: "",
    status: "ordered",
  });

  // ---------------- FETCH DATA ----------------
  const loadOrders = async () => {
    const res = await fetch(`${API}/purchase-orders`);
    setOrders(await res.json());
  };

  const loadProducts = async () => {
    const res = await fetch(`${API}/products`);
    setProducts(await res.json());
  };

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, [orders]);

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (!form.supplier_name || !form.product_id || !form.quantity) {
      setSnack({
        message: "Please fill all fields",
        color: "red",
        type: "error",
        open: true,
      });
      return;
    }

    const data = new FormData();
    data.append("supplier_name", form.supplier_name);
    data.append("product_id", form.product_id);
    data.append("quantity", form.quantity);
    data.append("status", form.status);

    axios.post(`${API}/purchase-orders`, data)
    setAdd_Open(false);
    setSnack({
      message: "Order Placed Successfully",
      color: "green",
      type: "success",
      open: true,
    });
    setForm({
      supplier_name: "",
      product_id: "",
      quantity: "",
      status: "ordered",
    });

    loadOrders();
  };

  const handleDelete = async (order) => {
    await axios.delete(`${API}/purchase-orders/${order.id}`);
    setSnack({
      message: "Order Deleted Successfully",
      color: "green",
      type: "success",
      open: true,
    });
    loadOrders();
  };
  // ---------------- EDIT ----------------
  const handleEdit = (row) => {
    setId(row.id);
    console.log("Editing row:", row,);
    setForm({
      supplier_name: row.supplier_name,
      product_id: row.product_id,
      quantity: row.quantity,
      status: row.status,
    });
    console.log("Form set to:", form);
    setEdit_Open(true);
  };
 const handleEditSubmit = async () => {
  const data = new FormData();
    data.append("supplier_name", form.supplier_name);
    data.append("product_id", form.product_id);
    data.append("quantity", form.quantity);
    data.append("status", form.status);

    axios.put(`${API}/purchase-orders/${id}`, data)
    setSnack({
      message: "Status Updated Successfully",
      color: "green",
      type: "success",
      open: true,
    });
    setEdit_Open(false);
 setForm({
      supplier_name: "",
      product_id: "",
      quantity: "",
      status: "ordered",
    });
    loadOrders();
  };
  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <h2>Purchase Orders</h2>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: "#003135", mt: 4 }}
          onClick={() => setAdd_Open(true)}
        >
          Place Order
        </Button>
      </Box>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supplier</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.supplier_name}</TableCell>
                <TableCell>
                   {o.product_name}
                </TableCell>
                <TableCell>{o.quantity}</TableCell>
                <TableCell>{o.status}</TableCell>
                <TableCell>{o.order_date}</TableCell>
                               <TableCell>
                  <Button size="small" onClick={() => handleEdit(o)}>
                    Edit
                  </Button></TableCell><TableCell>
                   <Button size="small" onClick={() => handleDelete(o)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOG */}
      <Dialog open={add_open} onClose={() => setAdd_Open(false)} fullWidth>
        <DialogTitle>
   Place Order
          
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          <TextField
            fullWidth
            select
            label="Supplier Name"
            value={form.supplier_name}
            onChange={(e) =>
              setForm({ ...form, supplier_name: e.target.value })
            }
            margin="dense"
          > 
          {suppliers.map((p) => (
              <MenuItem key={p.id} value={p.name}>
                 {p.name}
              </MenuItem>
            ))}
            </TextField>

          <TextField
            fullWidth
            select
            label="Product"
            value={form.product_id}
            onChange={(e) =>
              setForm({ ...form, product_id: e.target.value })
            }
            margin="dense"
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                 {p.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type="number"
            label="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
            margin="dense"
          />

          <TextField
            fullWidth
            select
            label="Status"
value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            margin="dense"
          >
            <MenuItem value="ordered">Ordered</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAdd_Open(false)}><Typography color="#003135">Cancel</Typography></Button>
          <Button variant="contained" sx={{ backgroundColor: "#003135" }} onClick={handleSubmit}>
            Place Order
          </Button>
        </DialogActions>
      </Dialog>
        <Dialog open={edit_open} onClose={() => setEdit_Open(false)} fullWidth>
        <DialogTitle>
   Edit Order
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          <TextField
            fullWidth
            select
            label="Supplier Name"
            disabled
            value={form.supplier_name}
            onChange={(e) =>
              setForm({ ...form, supplier_name: e.target.value })
            }
            margin="dense"
          > 
          {suppliers.map((p) => (
              <MenuItem key={p.id} value={p.name}>
                 {p.name}
              </MenuItem>
            ))}
            </TextField>

          <TextField
            fullWidth
            select
            label="Product"
            disabled
            value={form.product_id}
            onChange={(e) =>
              setForm({ ...form, product_id: e.target.value })
            }
            margin="dense"
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                 {p.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type="number"
            label="Quantity"
            disabled
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
            margin="dense"
          />

          <TextField
            fullWidth
            select
            label="Status"
            disabled={form.status === "delivered"}
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            margin="dense"
          >
            <MenuItem value="ordered">Ordered</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEdit_Open(false)}><Typography color="#003135">Cancel</Typography></Button>
          <Button variant="contained"  sx={{ backgroundColor: "#003135" }} onClick={handleEditSubmit}>
            Edit The Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

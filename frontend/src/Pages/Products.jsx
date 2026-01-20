import { useEffect, useState,useContext } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton
} from "@mui/material";
import {API_URL} from "../api";
import { UserContext,SnackContext } from "../context/UserContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const API = API_URL;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const {setSnack}=useContext(SnackContext);
  

  const [form, setForm] = useState({
    name: "",
    quantity: "",
    price: "",
    image: null
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await axios.get(`${API}/products`);
    setProducts(res.data);
  };

  const openAdd = () => {
    setEditMode(false);
    setForm({ name: "", quantity: "", price: "", image: null });
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditMode(true);
    setCurrentId(p.id);
    setForm({
      name: p.name,
      quantity: p.quantity,
      price: p.price,
      image: null
    });
    setOpen(true);
  };

  const validate = () => {
  if (!form.name.trim()) {
    setSnack({
       message: "Product name is required",
    color: "error",
    open: true,
    });
    return false;
  }

  if (!form.quantity || form.quantity < 0) {
    setSnack({
       message: "Quantity must be greater than 0",
    color: "error",
    open: true,
    });
    return false;
  }

  if (!form.price || form.price < 0) {
    setSnack({
       message: "Price must be greater than 0",
    color: "error",
    open: true,
    });
    return false;
  }

  if (!editMode && !form.image) {
    setSnack({
       message: "Please select a product image",
    color: "error",
    open: true,
    });
    return false;
  }

  return true;
};
  const handleSubmit = async () => {
    if (!validate()) return;
    const data = new FormData();
    data.append("name", form.name);
    data.append("quantity", form.quantity);
    data.append("price", form.price);
    if (form.image) data.append("image", form.image);

    if (editMode) {
      await axios.put(`${API}/products/${currentId}`, data);
    } else {
      await axios.post(`${API}/products`, data);
    }

    setOpen(false);
    setSnack({
        message: editMode ? "Product updated" : "Product added",
    color: "success",
    open: true,
    });
    loadProducts();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await axios.delete(`${API}/products/${id}`);
    loadProducts();
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Add button */}
      <Button
        variant="contained"
        style={{ float: "right", marginBottom: 10 , backgroundColor: "#003135" }}
        onClick={openAdd}
      >
        + Add Product
      </Button>

      <h2>Products</h2>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <img src={p.image} width="60" />
              </TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.quantity}</TableCell>
              <TableCell>₹{p.price}</TableCell>
              <TableCell>
                <IconButton onClick={() => openEdit(p)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => deleteProduct(p.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editMode ? "Edit Product" : "Add Product"}</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            margin="dense"
            size="small"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            fullWidth
            label="Quantity"
            margin="dense"
            size="small"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />

          <TextField
            fullWidth
            label="Price"
            margin="dense"
            size="small"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
<br/><br/>
          <input
            type="file"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />
        </DialogContent>

        <DialogActions>
          <Button color="#003135" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: "#003135" }} onClick={handleSubmit}>
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

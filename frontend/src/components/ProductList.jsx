import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { getProducts, updateProduct, deleteProduct } from "../api";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Edit
  const handleEditOpen = (product) => {
    setCurrentProduct(product);
    setEditDialog(true);
  };

  const handleEditClose = () => {
    setEditDialog(false);
    setCurrentProduct(null);
  };

  const handleEditSave = async () => {
    try {
      await updateProduct(currentProduct.id, currentProduct);
      handleEditClose();
      fetchProducts();
      alert("✅ Product updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  // Handle Delete
  const handleDeleteOpen = (product) => {
    setCurrentProduct(product);
    setDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialog(false);
    setCurrentProduct(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(currentProduct.id);
      handleDeleteClose();
      fetchProducts();
      alert("🗑️ Product deleted!");
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  // Handle form changes in dialog
  const handleChange = (e) => {
    setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          📦 Product List
        </Typography>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#003135" }}>
              <TableCell sx={{ color: "white" }}>ID</TableCell>
              <TableCell sx={{ color: "white" }}>Name</TableCell>
              <TableCell sx={{ color: "white" }}>Quantity</TableCell>
              <TableCell sx={{ color: "white" }}>Price (₹)</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.quantity}</TableCell>
                  <TableCell>{p.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1, backgroundColor: "#003135", color: "ButtonShadow" }}
                      onClick={() => handleEditOpen(p)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{ color:"#003135",borderColor:"#003135"}}
                      onClick={() => handleDeleteOpen(p)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
       <Dialog open={editDialog} onClose={handleEditClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            name="name"
            value={currentProduct?.name || ""}
            onChange={handleChange}
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={currentProduct?.quantity || ""}
            onChange={handleChange}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={currentProduct?.price || ""}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{ mt:2, color:"#003135",borderColor:"#003135"}} onClick={handleEditClose}>Cancel</Button>
          <Button variant="contained"sx={{ mt: 2, backgroundColor: "#003135" }} onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
<Dialog open={deleteDialog} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <b>{currentProduct?.name}</b>?
        </DialogContent>
        <DialogActions>
          <Button sx={{ mt: 2,color:"#003135",borderColor:"#003135"}} onClick={handleDeleteClose}>Cancel</Button>
          <Button color="error" variant="contained" sx={{ mt: 2, backgroundColor: "#003135" }} onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

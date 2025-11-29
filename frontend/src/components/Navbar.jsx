import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#003135" }}>
      <Toolbar>
        <InventoryIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Inventory Manager
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/add">
          Add Product
        </Button>
      </Toolbar>
    </AppBar>
  );
}

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Grid
} from "@mui/material";
import { UserContext, SnackContext } from "../context/UserContext";


export function Login() {
  const { userProfile, setUserProfile } = useContext(UserContext);
  const { snack, setSnack } = useContext(SnackContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.phone || !formData.role) {
      alert("Please fill all fields");
      return;
    }
    console.log("Form Data:", formData);
    console.log(JSON.stringify(formData));
    setUserProfile(formData)
    console.log(userProfile);

    setSnack({
      message: "Login Successful",
      color: "green",
      type: "success",
      open: true,
    });

    navigate("/dashboard", { replace: true });
  }
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Card sx={{ width: 350, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Typography variant="h5" textAlign="center" mb={1}>
            Login
          </Typography>
          </Grid>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              size="small"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              size="small"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              inputProps={{ maxLength: 10 }}
              required
            />

            <TextField
              fullWidth
              label="Role"
              name="role"
              size="small"
              value={formData.role}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Button
              type="submit"
              variant="contained"
              size="small"
              fullWidth
              sx={{ backgroundColor: "#003135", mt: 2 }}
            >
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

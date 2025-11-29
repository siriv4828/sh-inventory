import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Dashboard} from "./Pages/Dashboard";
import AddProductForm from "./components/AddProductForm";
import {LeftDrawer} from "./components/LeftDrawer";
import { Box, CssBaseline, Toolbar, AppBar, Typography } from "@mui/material";
import ProductList from "./components/ProductList";
import Inventory from "./Pages/Inventory";

const drawerWidth = 220;

export default function App() {
  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* Top AppBar */}
        <AppBar position="fixed" sx={{ zIndex: 1201,backgroundColor:"#003135" }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Inventory Management
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Left Drawer */}
        <LeftDrawer />

        {/* Main Content */}
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3, ml: `${drawerWidth}px` }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddProductForm />} />
            <Route path="/products"element={<ProductList/>}/>
            <Route path="/inventory"element={<Inventory/>}/>
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}






// import logo from './logo.svg';
// import './App.css';

//   import React, { useEffect, useState } from "react";

// function App() {
//   const [users, setUsers] = useState([]);
//   const [name, setName] = useState("");

//   const API_URL = "http://127.0.0.1:8000";
//   // const API_URL = "https://fastapi-backend.onrender.com";

//   useEffect(() => {
//     fetch(`${API_URL}/api/users`)
//       .then((res) => res.json())
//       .then((data) => setUsers(data))
//       .catch((err) => console.error(err));
//   }, []);

//   const handleAdd = async () => {
//     const res = await fetch(`${API_URL}/api/users?name=${name}`, {
//       method: "POST",
//     });
//     const data = await res.json();
//     alert(data.message);
//     setUsers([...users, data.user]);
//     setName("");
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>React + FastAPI + PostgreSQL Demo</h1>

//       <input
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Enter name"
//       />
//       <button onClick={handleAdd}>Add User</button>

//       <h2>Users List</h2>
//       <ul>
//         {users.map((u) => (
//           <li key={u.id}>{u.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
 

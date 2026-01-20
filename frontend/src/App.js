import React ,{useState}from "react";
import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom";
import { Dashboard } from "./Pages/Dashboard";
import AddProductForm from "./components/AddProductForm";
import { LeftDrawer } from "./components/LeftDrawer";
import { Box, CssBaseline, Toolbar, AppBar, Typography ,Snackbar,Slide,Alert} from "@mui/material";
import ProductList from "./components/ProductList";
import Inventory from "./Pages/Inventory";
import Suppliers from "./Pages/Suppliers";
import PurchaseOrders from "./Pages/PurchaseOrders";
import { Login } from "./Pages/Login";
import { Home } from "./Pages/Home";
import { UserContext, SnackContext } from "./context/UserContext";
import Products from "./Pages/Products";

const drawerWidth = 220;

export default function App() {
  const [userProfile, setUserProfile] = useState();
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({
    message: "",
    color: "",
    open: false,
  });
  return (
    <div>
      <Snackbar
        open={snack.open}
        autoHideDuration={2000}
        onClose={() => {
          setSnack((prevdata) => {
            return {
              ...prevdata,
              open: false,
            };
          });
        }}
        TransitionComponent={Slide}
      >
        <Alert
          variant="filled"
          onClose={() => {
            setSnack((prevdata) => {
              return {
                ...prevdata,
                open: false,
              };
            });
          }}
          severity={snack.type}
        >
          {snack.message}
        </Alert>
      </Snackbar>
      <UserContext.Provider value={{ userProfile, setUserProfile }}>
        <SnackContext.Provider value={{ snack, setSnack }}>
          <Router>
            <Routes>

              {/* First page → Registration */}
              <Route
                path="/"
                element={
                  userProfile
                    ? <Navigate to="/dashboard" replace />
                    : <Login />
                }
              />

              {/* Dashboard (protected) */}
              <Route
                path="/dashboard/*"
                element={
                  userProfile
                    ? <Dashboard />
                    : <Navigate to="/" replace />
                }
              >
                <Route index element={<Navigate to="home" replace />} />
                <Route path="home" element={<Home />} />
                <Route path="add" element={<AddProductForm />} />
                <Route path="products" element={<Products />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="purchase-orders" element={<PurchaseOrders />} />
                <Route path="*" element={<Navigate to="home" replace />} />

              </Route>

            </Routes>
          </Router>
        </SnackContext.Provider>
      </UserContext.Provider>
    </div>
    // <Router>
    //   <Box sx={{ display: "flex" }}>
    //     <CssBaseline />

    //     {/* Left Drawer */}
    //     <LeftDrawer />

    //     {/* Main Content */}
    //     <Box
    //       component="main"
    //       sx={{ flexGrow: 1, bgcolor: "background.default", p: 3,
    //       marginLeft: { sm: `${drawerWidth}px` }
    //        }}
    //     >
    //       <Toolbar />
    //       <Routes>
    //         <Route path="/" element={<Dashboard />} />
    //         <Route path="/add" element={<AddProductForm />} />
    //         <Route path="/products"element={<ProductList/>}/>
    //         <Route path="/inventory"element={<Inventory/>}/>
    //       </Routes>
    //     </Box>
    //   </Box>
    // </Router>
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


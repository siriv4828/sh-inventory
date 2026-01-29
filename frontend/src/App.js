import React ,{useState}from "react";
import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom";
import { Dashboard } from "./Pages/Dashboard";
import AddProductForm from "./components/AddProductForm";
import { LeftDrawer } from "./components/LeftDrawer";
import { Box, CssBaseline, Toolbar, AppBar, Typography ,Snackbar,Slide,Alert, ThemeProvider,createTheme} from "@mui/material";
import ProductList from "./components/ProductList";
import Inventory from "./Pages/Inventory";
import Suppliers from "./Pages/Suppliers";
import PurchaseOrders from "./Pages/PurchaseOrders";
import { Login } from "./Pages/Login";
import { Home } from "./Pages/Home";
import { UserContext, SnackContext } from "./context/UserContext";
import Products from "./Pages/Products";
import Sales from "./Pages/Sales";

export default function App() {
  const [userProfile, setUserProfile] = useState();
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({
    message: "",
    color: "",
    open: false,
  });

  const theme = createTheme({
  palette: {
    primary: { main: "#003135" },
    secondary: { main: "#f59e0b" },
    background: {
      default: "#f9fafb",
    },
  },
  typography: {
    fontFamily: "Poppins",
    h6: {
      fontWeight: 600,
    },
  },
});

  return (
    <div>
      <ThemeProvider theme={theme}>
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
                <Route path="sales" element={<Sales />} />
                <Route path="purchase-orders" element={<PurchaseOrders />} />
                <Route path="*" element={<Navigate to="home" replace />} />

              </Route>

            </Routes>
          </Router>
        </SnackContext.Provider>
      </UserContext.Provider>
 </ThemeProvider>
    </div>
  );
}
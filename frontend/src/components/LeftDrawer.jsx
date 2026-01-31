import React, { useState, useContext } from "react";
import { Drawer,Menu, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar,Divider,useTheme,useMediaQuery,Dialog,DialogActions,DialogContentText,DialogContent ,Box,AppBar,IconButton,CssBaseline,Button,Typography} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import InventoryIcon from "@mui/icons-material/Inventory";
import DevicesIcon from "@mui/icons-material/Devices";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext, SnackContext } from "../context/UserContext";
import LogoutIcon from "@mui/icons-material/Logout";

export function LeftDrawer() {
   const { userProfile, setUserProfile } = useContext(UserContext);
  const { snack, setSnack } = useContext(SnackContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutDailog, setShowLogoutDailog] = useState(false);
   const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    if (isMobile) setMobileOpen(!mobileOpen);
    else setCollapsed(!collapsed);
  };

  const logOutAPI = async () => {
    setShowLogoutDailog(false);

    setUserProfile(null);
    setSnack({
      message: "Logout Successfully",
      color: "green",
      type: "success",
      open: true,
    });
    console.log("Logging out user:", userProfile);
    navigate("/", { replace: true });
  };

  const drawerContent = (
    <>
      <Toolbar />
      <Divider />

      <List>
        {[
          { text: "Dashboard", link: "/", icon: <DashboardIcon sx={{ color: "white" }} /> },
          { text: "Products", link: "/dashboard/products", icon: <DevicesIcon sx={{ color: "white" }} /> },
          { text: "Inventory", link: "/dashboard/inventory", icon: <InventoryIcon sx={{ color: "white" }} /> },
          { text: "Purchase Orders", link: "/dashboard/purchase-orders", icon: <ShoppingCartIcon sx={{ color: "white" }} /> },
          { text: "Sales", link: "/dashboard/sales", icon: <PointOfSaleIcon sx={{ color: "white" }} /> },
          { text: "Suppliers", link: "/dashboard/suppliers", icon: <LocalShippingIcon sx={{ color: "white" }} /> },
        ].map((item) => (
          <ListItem button key={item.text} onClick={() => setMobileOpen(false)}>
            <ListItemButton component={Link} to={item.link} sx={{mt:-2,pb:-2,mr:-2,ml:-2}}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              {!collapsed && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ flexGrow: 1, }}></Box>
     <ListItem button key={"name"}>
        <ListItemButton onClick={handleOpen}sx={{mt:-2,pb:-2,mr:-2,ml:-2}}>
          <ListItemIcon><AccountCircleIcon sx={{ color: "white" }} /></ListItemIcon>
          {!collapsed && <ListItemText primary={userProfile?.name} />}
        </ListItemButton>
          <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box px={5} py={1}>
          <Typography fontWeight="bold">{userProfile?.name}{"----"}{userProfile?.role}</Typography>
          <Typography variant="body2" color="text.secondary">
           {"ph"}{"----"} {userProfile?.phone}
          </Typography>
           {/* <Typography variant="body2" color="text.secondary">
            {userProfile?.role}
          </Typography> */}
        </Box></Menu>
      </ListItem>
      <ListItem button key={"logout"}>
        <ListItemButton onClick={() => setShowLogoutDailog(true)} sx={{mt:-2,pb:-2,mr:-2,ml:-2}}>
          <ListItemIcon><LogoutIcon sx={{ color: "white" }} /></ListItemIcon>
          {!collapsed && <ListItemText primary={"logout"} />}
        </ListItemButton>
      </ListItem>

    </>);
  return (
    // left drawer
    <Box>
      <Dialog
        open={showLogoutDailog}
        onClose={() => {
          setShowLogoutDailog(false);
        }}
      >
        <DialogContent>
          <DialogContentText>Are you sure to logout</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              logOutAPI();
            }}
          >
            yes
          </Button>
          <Button
            onClick={() => {
              setShowLogoutDailog(false);
            }}
          >
            no
          </Button>
        </DialogActions>
      </Dialog>
      <CssBaseline />

      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="small">Inventory Management</Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            backgroundColor: "#003135",
            color: "white"
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

import React, { useState, useContext } from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar,Divider,useTheme,useMediaQuery,Dialog,DialogActions,DialogContentText,DialogContent ,Box,AppBar,IconButton,CssBaseline,Button,Typography} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import InventoryIcon from "@mui/icons-material/Inventory";
import DevicesIcon from "@mui/icons-material/Devices";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import { UserContext, SnackContext } from "../Context/UserContext.jsx";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 220;

export function LeftDrawer() {
  //  const { userProfile, setUserProfile } = useContext(UserContext);
  // const { snack, setSnack } = useContext(SnackContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutDailog, setShowLogoutDailog] = useState(false);

  const handleDrawerToggle = () => {
    if (isMobile) setMobileOpen(!mobileOpen);
    else setCollapsed(!collapsed);
  };

  const logOutAPI = async () => {
    setShowLogoutDailog(false);

    // setUserProfile(null);
    // setSnack({
    //   message: t("logout_successfully"),
    //   color: "green",
    //   type: "success",
    //   open: true,
    // });
    // console.log("Logging out user:", userProfile);
    navigate("/", { replace: true });
  };

  const drawerContent = (
    <>
      <Toolbar />
      <Divider />

      <List>
        {[
          { text: "Dashboard", link: "/", icon: <DashboardIcon sx={{ color: "white" }} /> },
          { text: "Products", link: "/products", icon: <DevicesIcon sx={{ color: "white" }} /> },
          { text: "Inventory", link: "/inventory", icon: <InventoryIcon sx={{ color: "white" }} /> },
          { text: "AddProducts", link: "/add", icon: <AddBoxIcon sx={{ color: "white" }} /> },
        ].map((item) => (
          <ListItem button key={item.text} onClick={() => setMobileOpen(false)}>
            <ListItemButton component={Link} to={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              {!collapsed && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem button key={"logout"}>
        <ListItemButton onClick={() => setShowLogoutDailog(true)}>
          <ListItemIcon><LogoutIcon sx={{ color: "white" }} /></ListItemIcon>
          {!collapsed && <ListItemText primary={"logout"} />}
        </ListItemButton>
      </ListItem>

    </>);
  return (
    // left drawer
    <Box >
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
          backgroundColor: "#003135",
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

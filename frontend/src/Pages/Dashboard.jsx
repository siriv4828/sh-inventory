import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { LeftDrawer } from "../components/LeftDrawer.jsx";
import { Box, CssBaseline, Toolbar, AppBar, Typography, useTheme, useMediaQuery } from "@mui/material";
import { UserContext } from "../context/UserContext.jsx";

const drawerWidth = 240;
export function Dashboard() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { userProfile, setUserProfile } = useContext(UserContext);
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <LeftDrawer />
            <Box
                component="main"
                sx={{
                    flexGrow: 1, bgcolor: "background.default", p: 3,
                    ml: isMobile ? 0 : `${drawerWidth}px`,
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>

    );
}


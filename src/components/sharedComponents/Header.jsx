import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth.js";
import { pathsWithoutHeaderAndMenu } from "../../App.js";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Tooltip
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useLocation } from "react-router-dom";
import capitalize from "capitalize-pt-br";
import useReload from "../../hooks/useReload.js";

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const { shouldReload } = useReload();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await user();
      setUserData(data);
    };

    fetchUserData();
  }, [user, shouldReload]);

  if (pathsWithoutHeaderAndMenu.includes(location.pathname)) {
    return null;
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#0A69DD",
        boxShadow: "none",
        borderRadius: "16px"
      }}
    >
      <Toolbar>
        <Avatar
          alt={capitalize(userData?.name.trim())}
          src={userData?.userPicture}
          sx={{ width: 40, height: 40, marginRight: 2 }}
        />
        <div style={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            {capitalize(userData?.name.trim())}
          </Typography>
          <Typography variant="body2" color="white">
            Total of task lists: {userData?.taskListsCreated || 0}
          </Typography>
        </div>
        <Tooltip title="Logout">
          <IconButton color="inherit" onClick={logout} tooltip="Logout">
            <LogoutOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}

import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Container } from "@mui/material";
// import api from "../services/api.js";
import useAuth from "../hooks/useAuth.js";
// import AlertList from "../components/AlertList.jsx";
// import LoadingDialog from "../components/LoadingDialog.jsx";
import { pathsWithoutHeaderAndMenu } from "../App.js";
import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useLocation } from "react-router-dom";
import capitalize from "capitalize-pt-br";

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await user();
      setUserData(data);
    };

    fetchUserData();
  }, [user]);

  if (pathsWithoutHeaderAndMenu.includes(location.pathname)) {
    return null;
  }
  //   console.log(userData)
  //   console.log(auth.token)

  return (
    <AppBar position="static" sx={{ backgroundColor: "#0A69DD" }}>
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
        <IconButton color="inherit" onClick={logout} aria-label="Logout">
          <LogoutOutlinedIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Link } from "@mui/material";
import { Box } from "@mui/system";
import api from "../services/api.js";
import logo from "../assets/img/toDo.png";
import useAuth from "../hooks/useAuth.js";
import AlertList from "../components/AlertList.jsx";
import LoadingDialog from "../components/LoadingDialog.jsx";
import useMyTasksList from "../hooks/useMyTaskLists.js";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [alertShown, setAlertShown] = useState(false);
  const { auth, login } = useAuth();
  const { setMyTaskLists } = useMyTasksList();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth && auth.token) {
      loadTaskLists();
      navigate("/myTaskLists");
    }
  }, [auth, navigate]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setOpen(true);

    try {
      const response = await api.login({ ...formData });
      login(response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data.errors ||
        error.response?.data.error ||
        "An unknow error occurred.";
      addAlert("error", "Error", errorMessage);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  }

  function addAlert(severity, title, message) {
    setAlerts((prevAlerts) => [...prevAlerts, { severity, title, message }]);
  }

  function handleAlertClose(index) {
    setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
  }

  async function loadTaskLists() {
    try {
      const response = await api.getTaskLists(auth.token);
      setMyTaskLists(response.data);
      if (response.data.length === 0 && !alertShown) {
        addAlert("info", "Info", "There's no task list yet!");
        setAlertShown(true);
      } else if (response.data.length > 0 && !alertShown) {
        addAlert("success", "Success!", "Task Lists loaded!");
        setAlertShown(true);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data.errors ||
        error.response?.data.error ||
        "An unknown error occurred.";
      addAlert("error", "Error", errorMessage);
    } finally {
      setOpen(false);
    }
  }

  return (
    <Container maxWidth="xs" sx={{ bgcolor: "#EEEEEE" }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <img
          alt="toDo.png"
          src={logo}
          style={{ marginBottom: "20px", marginTop: "20px" }}
          width={"250px"}
          height={"280px"}
        />

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              borderRadius: "16px",
              mt: 3,
              mb: 2,
              backgroundColor: "#096AE3",
              "&:hover": {
                backgroundColor: "#2CADFE"
              }
            }}
          >
            Login
          </Button>

          <Link href="/register" variant="body2" fullWidth>
            <Button
              type="button"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                borderRadius: "16px",
                mb: 2,
                backgroundColor: "#FE683F",
                "&:hover": {
                  backgroundColor: "#D74544"
                }
              }}
            >
              Don't have an account? Register now!
            </Button>
          </Link>
        </Box>
      </Box>

      <LoadingDialog open={open} onClose={() => setOpen(false)} />

      <AlertList alerts={alerts} onClose={handleAlertClose} />
    </Container>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Link } from "@mui/material";
import { Box } from "@mui/system";
import api from "../services/api.js";
import useAuth from "../hooks/useAuth.js";
import AlertList from "../components/sharedComponents/AlertList.jsx";
import LoadingDialog from "../components/sharedComponents/LoadingDialog.jsx";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    user_picture: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth && auth.token) {
      navigate("/my-toDos");
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
      const response = await api.signUp({ ...formData });
      response.then(() => {
        addAlert("success", "Success!", "New account registered.");
        setFormData({
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
          user_picture: ""
        });
      });
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

  return (
    <Container
      maxWidth="xs"
      sx={{ bgcolor: "#EEEEEE", mt: "85px", mb: "20px" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Name"
            name="name"
            type="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
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
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Confirm Password"
            name="password_confirmation"
            type="password"
            value={formData.password_confirmation}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Photo (URL)"
            name="user_picture"
            type="url"
            value={formData.user_picture}
            onChange={handleChange}
            disabled={isLoading}
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
            Register
          </Button>

          <Link variant="body2" fullWidth>
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
              onClick={() => navigate("/")}
            >
              Already registered? Login!
            </Button>
          </Link>
        </Box>
      </Box>

      <LoadingDialog open={open} onClose={() => setOpen(false)} />

      <AlertList alerts={alerts} onClose={handleAlertClose} />
    </Container>
  );
}

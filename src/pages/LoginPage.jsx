import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Container,
  TextField,
  Button,
  Link,
  Dialog
} from "@mui/material";
import { Box } from "@mui/system";
import api from "../services/api.js";
import logo from "../assets/img/toDo.png";
import useAuth from "../hooks/useAuth.js";
import AlertList from "../components/AlertList.jsx";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const { auth, login } = useAuth();
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

    const promise = api.login({ ...formData });

    promise
      .then((response) => {
        setIsLoading(false);
        login(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        setIsLoading(false);
        setOpen(false);

        if (error.response) {
          const errorMessage = error.response.data?.error;
          console.log(errorMessage);
          setAlerts((prevAlerts) => [
            ...prevAlerts,
            { severity: "error", title: "Error", message: errorMessage }
          ]);
        }
      });
  }

  const handleAlertClose = (index) => {
    setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
  };

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

          <Link variant="body2" fullWidth>
            <Button
              type="button"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: { backgroundColor: "transparent", boxShadow: "none" }
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" p={5}>
          <React.Fragment>
            <svg width={0} height={0}>
              <defs>
                <linearGradient
                  id="my_gradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#e01cd5" />
                  <stop offset="100%" stopColor="#1CB5E0" />
                </linearGradient>
              </defs>
            </svg>
            <CircularProgress
              size={60}
              sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
            />
          </React.Fragment>
        </Box>
      </Dialog>

      <AlertList alerts={alerts} onClose={handleAlertClose} />
    </Container>
  );
}

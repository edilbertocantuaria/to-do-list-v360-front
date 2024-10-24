import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import api from "../services/api.js";
import useAuth from "../hooks/useAuth.js";
import AlertList from "../components/AlertList.jsx";
import LoadingDialog from "../components/LoadingDialog.jsx";

export default function MyTaskLists() {
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [myTaskLists, setMyTaskLists] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth || !auth.token) {
      navigate("/");
    }
  }, [auth, navigate]);

  async function loadToDos() {
    if (!auth || !auth.token) return;

    setIsLoading(true);
    setOpen(true);

    try {
      const response = await api.getTaskLists(auth.token);
      setMyTaskLists(response.data);

      if (response.data.length === 0) {
        addAlert("info", "Info", "There's no task list yet!");
      } else {
        addAlert("success", "Success!", "Task Lists loaded!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data.errors ||
        error.response?.data.error ||
        "An unknown error occurred.";
      addAlert("error", "Error", errorMessage);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  }

  function addAlert(severity, title, message) {
    setAlerts((prevAlerts) => [...prevAlerts, { severity, title, message }]);
  }

  const handleAlertClose = (index) => {
    setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
  };

  useEffect(() => {
    loadToDos();
  }, []);

  return (
    <Container
      maxWidth="xs"
      sx={{ bgcolor: "#EEEEEE", mt: "85px", mb: "20px" }}
    >
      <>renderizar os cards aqui!!</>

      <LoadingDialog open={open} onClose={() => setOpen(false)} />

      <AlertList alerts={alerts} onClose={handleAlertClose} />
    </Container>
  );
}

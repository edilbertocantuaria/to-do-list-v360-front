import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Fab, Tooltip } from "@mui/material";
import api from "../services/api.js";
import useAuth from "../hooks/useAuth.js";
import AlertList from "../components/AlertList.jsx";
import Header from "../components/Header.jsx";
import AddIcon from "@mui/icons-material/Add";
import TaskListPage from "../components/TaskList/TaskListPage.jsx";
import LoadingDialog from "../components/LoadingDialog.jsx";

export default function MyTaskLists() {
  const [open, setOpen] = useState(false);
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
    <>
      <Header />
      <TaskListPage myTaskLists={myTaskLists} />

      <Tooltip title="New Task List">
        <Fab
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            marginBottom: "16px",
            backgroundColor: "#0A69DD",
            "&:hover": {
              backgroundColor: "#2CADFE"
            }
          }}
          onClick={() => alert("Novo task list!")}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      <LoadingDialog open={open} onClose={() => setOpen(false)} />
      <AlertList alerts={alerts} onClose={handleAlertClose} />
    </>
  );
}

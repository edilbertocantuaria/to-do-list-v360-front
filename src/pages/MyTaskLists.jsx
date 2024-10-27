/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Fab, Tooltip } from "@mui/material";
import api from "../services/api.js";
import useAuth from "../hooks/useAuth.js";
import useReload from "../hooks/useReload.js";
import AlertList from "../components/AlertList.jsx";
import Header from "../components/Header.jsx";
import AddIcon from "@mui/icons-material/Add";
import TaskListPage from "../components/TaskList/TaskListPage.jsx";
import LoadingDialog from "../components/LoadingDialog.jsx";
import NewTaskListDialog from "../components/TaskList/NewTaskListDialog.jsx";

export default function MyTaskLists() {
  const [open, setOpen] = useState(false);
  const [newTaskListDialogOpen, setNewTaskListDialogOpen] = useState(false);
  const [myTaskLists, setMyTaskLists] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [alertShown, setAlertShown] = useState(false);
  const [newTaskListTitle, setNewTaskListTitle] = useState("");
  const { auth } = useAuth();
  const { shouldReload, setShouldReload } = useReload();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth || !auth.token) {
      navigate("/");
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (shouldReload) loadTaskLists();
  }, [shouldReload]);

  async function loadTaskLists() {
    if (!auth || !auth.token) return;

    setOpen(true);

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
      setShouldReload(false);
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

  function handleAlertClose(index) {
    setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
  }

  const handleCreateTaskList = async () => {
    if (!newTaskListTitle) {
      addAlert("error", "Error", "Task list title cannot be empty!");
      return;
    }

    try {
      await api.createTaskList(auth.token, { title: newTaskListTitle });
      addAlert("success", "Success!", "Task list created!");
      setNewTaskListDialogOpen(false);
      setNewTaskListTitle("");
      setShouldReload(true);
    } catch (error) {
      const errorMessage =
        error.response?.data.errors ||
        error.response?.data.error ||
        "An unknown error occurred.";
      addAlert("error", "Error", errorMessage);
    }
  };

  const onUpdateTaskList = (updatedTaskList) => {
    setMyTaskLists((prevTaskLists) =>
      prevTaskLists.map((taskList) =>
        taskList.id === updatedTaskList.id ? updatedTaskList : taskList
      )
    );
  };

  return (
    <>
      <Header />
      <TaskListPage
        myTaskLists={myTaskLists}
        onUpdateTaskList={onUpdateTaskList}
      />

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
          onClick={() => setNewTaskListDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      <NewTaskListDialog
        open={newTaskListDialogOpen}
        onClose={() => setNewTaskListDialogOpen(false)}
        // onCreate={handleCreateTaskList}
        auth={auth}
      />

      <LoadingDialog open={open} onClose={() => setOpen(false)} />
      <AlertList alerts={alerts} onClose={handleAlertClose} />
    </>
  );
}

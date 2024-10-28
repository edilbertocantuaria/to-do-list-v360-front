import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Fab, Tooltip } from "@mui/material";
import api from "../services/api.js";
import useAuth from "../hooks/useAuth.js";
import useReload from "../hooks/useReload.js";
import useMyTasksList from "../hooks/useMyTaskLists.js";
import AlertList from "../components/sharedComponents/AlertList.jsx";
import Header from "../components/sharedComponents/Header.jsx";
import AddIcon from "@mui/icons-material/Add";
import TaskListPage from "../components/TaskList/TaskListPage.jsx";
import LoadingDialog from "../components/sharedComponents/LoadingDialog.jsx";
import NewTaskListDialog from "../components/TaskList/NewTaskListDialog.jsx";

export default function MyTaskLists() {
  const [open, setOpen] = useState(false);
  const [newTaskListDialogOpen, setNewTaskListDialogOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [alertShown, setAlertShown] = useState(false);

  const { auth } = useAuth();
  const { myTaskLists, setMyTaskLists, myTags, setMyTags } = useMyTasksList();
  const { shouldReload, setShouldReload } = useReload();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth || !auth.token) {
      navigate("/");
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (shouldReload) {
      loadTaskLists(), loadTags();
    }
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

  async function loadTags() {
    try {
      const response = await api.getTags(auth.token);
      setMyTags(response.data.tags);
    } catch (error) {
      const errorMessage =
        error.response?.data.errors ||
        error.response?.data.error ||
        "An unknown error occurred while we tried to get the tags.";
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
        myTags={myTags}
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
        myTags={myTags}
        onClose={() => setNewTaskListDialogOpen(false)}
        auth={auth}
      />

      <LoadingDialog open={open} onClose={() => setOpen(false)} />
      <AlertList alerts={alerts} onClose={handleAlertClose} />
    </>
  );
}

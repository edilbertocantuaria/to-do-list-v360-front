import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Fab,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  IconButton,
  Switch
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import api from "../services/api.js";
import useAuth from "../hooks/useAuth.js";
import AlertList from "../components/AlertList.jsx";
import Header from "../components/Header.jsx";
import AddIcon from "@mui/icons-material/Add";

export default function MyTaskLists() {
  // eslint-disable-next-line no-unused-vars
  const [, setIsLoading] = useState(false);
  const [, setOpen] = useState(false);
  const [myTaskLists, setMyTaskLists] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTaskList, setSelectedTaskList] = useState(null);
  const [, setTasks] = useState([]);

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

      if (response.data.length > 0) {
        setTasks(response.data[0].tasks);
      }

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

  const handleCardClick = (taskList) => {
    setSelectedTaskList(taskList);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTaskList(null);
  };

  const handleToggle = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, is_task_done: !task.is_task_done }
          : task
      )
    );
  };
  useEffect(() => {
    loadToDos();
  }, []);

  return (
    <>
      <Header />
      <Box
        sx={{
          width: "100%",
          bgcolor: "#EEEEEE",
          mt: "20px",
          mb: "20px",
          pt: 2,
          pb: 2,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          gap: "20px"
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography variant="h6" sx={{ mb: 1.5, mt: -2 }}>
            Pendentes
          </Typography>
        </Box>
        {myTaskLists
          .filter((taskList) => taskList.percentage < 100)
          .sort((a, b) => a.percentage - b.percentage)
          .map((taskList) => (
            <Box
              key={taskList.id}
              sx={{
                width: "200px",
                height: "200px",
                position: "relative",
                mb: "35px",
                flexShrink: 0
              }}
            >
              <Card
                onClick={() => handleCardClick(taskList)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  boxShadow: 3,
                  height: "100%"
                }}
              >
                <CardHeader
                  title={taskList.title}
                  titleTypographyProps={{
                    variant: "h6",
                    sx: {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "120px"
                    }
                  }}
                  action={
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  }
                />

                <CardContent
                  sx={{
                    flexGrow: 1,
                    height: "50px"
                  }}
                >
                  {taskList.tasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Switch
                        checked={task.is_task_done}
                        onChange={() => handleToggle(task.id)}
                        color="primary"
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: task.is_task_done
                            ? "line-through"
                            : "none",
                          fontStyle: task.is_task_done ? "italic" : "normal",
                          cursor: "pointer",
                          marginLeft: 1
                        }}
                      >
                        {task.task_description}
                      </Typography>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Box
                key={taskList.id}
                sx={{
                  height: "40px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: "0"
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={taskList.percentage}
                  sx={{
                    mt: 1,
                    mb: 1,
                    width: "100%",
                    borderRadius: "10px",
                    height: "8px"
                  }}
                />
                <div style={{ marginLeft: "10px", alignSelf: "center" }}>
                  {taskList.percentage}%
                </div>
              </Box>
            </Box>
          ))}

        <Box sx={{ width: "100%" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Concluídos
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {myTaskLists
              .filter((taskList) => taskList.percentage === 100)
              .map((taskList) => (
                <Box
                  key={taskList.id}
                  sx={{
                    width: "200px",
                    height: "200px",
                    position: "relative",
                    mb: "35px"
                  }}
                >
                  <Card
                    onClick={() => handleCardClick(taskList)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      boxShadow: 3,
                      height: "100%"
                    }}
                  >
                    <CardHeader
                      title={taskList.title}
                      titleTypographyProps={{
                        variant: "h6",
                        sx: {
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "120px"
                        }
                      }}
                      action={
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <ShareIcon />
                        </IconButton>
                      }
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        height: "50px"
                      }}
                    >
                      {taskList.tasks.slice(0, 3).map((task) => (
                        <Typography
                          key={task.id}
                          variant="body1"
                          sx={{
                            textDecoration: task.is_task_done
                              ? "line-through"
                              : "none",
                            fontStyle: task.is_task_done ? "italic" : "normal",
                            cursor: "pointer"
                          }}
                        >
                          <li>{task.task_description}</li>
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                  <Box
                    key={taskList.id}
                    sx={{
                      height: "40px",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      mt: "0"
                    }}
                  >
                    <LinearProgress
                      variant="determinate"
                      value={taskList.percentage}
                      sx={{
                        mt: 1,
                        mb: 1,
                        width: "100%",
                        borderRadius: "10px",
                        height: "8px"
                      }}
                    />
                    <div style={{ marginLeft: "10px", alignSelf: "center" }}>
                      {taskList.percentage}%
                    </div>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{selectedTaskList?.title}</DialogTitle>
        <DialogContent>
          {selectedTaskList?.tasks.map((task) => (
            <div
              key={task.id}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Switch
                checked={task.is_task_done}
                onChange={() => handleToggle(task.id)} // Ajuste para que funcione no diálogo, se necessário
                color="primary"
              />
              <Typography
                variant="body1"
                sx={{
                  textDecoration: task.is_task_done ? "line-through" : "none",
                  fontStyle: task.is_task_done ? "italic" : "normal",
                  cursor: "pointer",
                  marginLeft: 1
                }}
              >
                {task.task_description}
              </Typography>
            </div>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

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

      <AlertList alerts={alerts} onClose={handleAlertClose} />
    </>
  );
}

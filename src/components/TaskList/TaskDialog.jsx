/* eslint-disable no-unused-vars */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Switch,
  TextField,
  Grid2,
  Tooltip,
  IconButton
} from "@mui/material";
import { useState, useEffect } from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

export default function TaskDialog({ open, taskList, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (taskList) {
      setTasks(taskList.tasks || []);
    }
  }, [taskList]);

  function handleToggle(taskId) {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, is_task_done: !task.is_task_done } : task
    );
    setTasks(updatedTasks);

    // Call API to update task
  }

  function handleDelete(taskId) {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);

    // Call API to delete task
  }

  function handleEdit(taskId) {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isEditing: !task.isEditing } : task
    );
    setTasks(updatedTasks);
    // Logic to edit a task (e.g., show a dialog or inline edit)
  }

  function handleAddTask() {
    if (newTask.trim()) {
      const newTaskObj = {
        task_description: newTask
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask("");
      // Call API to add new task
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>{taskList?.title}</DialogTitle>
      <DialogContent>
        <Grid2 container spacing={2}>
          {tasks.map((task) => (
            <Grid2 item xs={12} key={task.id}>
              <Grid2
                container
                alignItems="center"
                justifyContent="space-between"
                sx={{ position: "relative" }}
              >
                <Grid2 item width={875}>
                  <Grid2 container alignItems="center">
                    <Grid2 item>
                      <Switch
                        checked={task.is_task_done}
                        onChange={() => handleToggle(task.id)}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#FD7E00"
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#FD7E00"
                            }
                        }}
                      />
                    </Grid2>
                    <Grid2 item>
                      {task.isEditing ? (
                        <TextField
                          value={task.task_description}
                          onChange={(e) =>
                            setTasks(
                              tasks.map((t) =>
                                t.id === task.id
                                  ? { ...t, task_description: e.target.value }
                                  : t
                              )
                            )
                          }
                          sx={{ width: "46.16vw" }}
                          onBlur={() => handleEdit(task.id)}
                        />
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{
                            textDecoration: task.is_task_done
                              ? "line-through"
                              : "none",
                            fontStyle: task.is_task_done ? "italic" : "normal",
                            marginLeft: 1,
                            whiteSpace: "normal",
                            wordBreak: "break-word"
                          }}
                        >
                          {task.task_description}
                        </Typography>
                      )}
                    </Grid2>
                  </Grid2>
                </Grid2>

                <Grid2
                  item
                  sx={{
                    position: "absolute",
                    right: 0,
                    display: "flex",
                    gap: 1
                  }}
                >
                  <Tooltip title="Edit task">
                    <IconButton
                      onClick={() => handleEdit(task.id)}
                      sx={{ color: "#0769A8" }}
                    >
                      <CreateOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete task">
                    <IconButton
                      onClick={() => handleDelete(task.id)}
                      sx={{ color: "#DA4646" }}
                    >
                      <DeleteForeverOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </Grid2>
              </Grid2>
            </Grid2>
          ))}
          <Grid2 item xs={12}>
            <Grid2
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{ position: "relative" }}
            >
              <Grid2 item width={875}>
                <Grid2 container alignItems="center">
                  <Grid2 item>
                    <TextField
                      label="New Task"
                      variant="outlined"
                      fullWidth
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      sx={{ marginBottom: 2, width: "50vw" }}
                    />
                  </Grid2>
                </Grid2>
              </Grid2>

              <Grid2
                item
                sx={{
                  position: "absolute",
                  right: 0,
                  display: "flex",
                  gap: 1
                }}
              >
                <Tooltip title="Save new task">
                  <IconButton
                    onClick={() => handleAddTask(newTask)}
                    sx={{ color: "#109DCB" }}
                  >
                    <CheckOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Grid2>
            </Grid2>
          </Grid2>
        </Grid2>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#0A6AE2" }}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

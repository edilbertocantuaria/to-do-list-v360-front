import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid2
} from "@mui/material";
import { useState, useEffect } from "react";
import TaskDetail from "../tasks/TaskDetail";
import NewTaskInput from "../tasks/NewTaskInput";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import useReload from "../../hooks/useReload";
import AlertList from "../AlertList";

export default function TaskDialog({ open, setOpen, taskList, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editValue, setEditValue] = useState("");
  const [originalTaskValue, setOriginalTaskValue] = useState("");

  const { auth } = useAuth();
  const { setShouldReload } = useReload();

  useEffect(() => {
    if (taskList && taskList.tasks) {
      setTasks(taskList.tasks);
    }
  }, [taskList]);

  async function handleAddTask() {
    if (newTask.trim()) {
      const newTaskObj = { task_description: newTask };

      try {
        await api.postTask(taskList.id, newTaskObj, auth.token);
        setNewTask("");
        setShouldReload(true);
      } catch (error) {
        const errorMessage =
          error.response?.data.errors ||
          error.response?.data.error ||
          "An unknown error occurred.";
        addAlert("error", "Error", errorMessage);
      }
    }
  }

  async function handleTaskChange(taskId, action, taskDescription) {
    const taskToChange = tasks.find((task) => task.id === taskId);

    if (taskToChange) {
      let updatedTask;

      if (action === "toggle") {
        updatedTask = {
          ...taskToChange,
          is_task_done: !taskToChange.is_task_done
        };
      } else if (action === "edit") {
        updatedTask = {
          ...taskToChange,
          task_description: taskDescription,
          isEditing: false
        };
      }

      try {
        const body =
          action === "toggle"
            ? { is_task_done: updatedTask.is_task_done }
            : { task_description: taskDescription };

        await api.putTask(taskList.id, taskId, body, auth.token);
        setShouldReload(true);

        if (action === "edit") {
          setOriginalTaskValue(taskDescription);
          setEditValue(taskDescription);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data.errors ||
          error.response?.data.error ||
          "An unknown error occurred.";

        if (action === "edit") {
          const revertedTasks = tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  task_description: originalTaskValue,
                  isEditing: false
                }
              : task
          );
          setTasks(revertedTasks);
        }

        addAlert("error", "Error", errorMessage);
      }
    }
  }

  async function handleDelete(taskId) {
    try {
      await api.deleteTask(taskList.id, taskId, auth.token);
      setShouldReload(true);
    } catch (error) {
      const errorMessage =
        error.response?.data.errors ||
        error.response?.data.error ||
        "An unknown error occurred.";

      addAlert("error", "Error", errorMessage);
    }
  }

  async function handleDeleteTaskList(taskList) {
    try {
      await api.deleteTaskList(taskList, auth.token);
      setOpen(false);
      setShouldReload(true);
    } catch (error) {
      const errorMessage =
        error.response?.data.errors ||
        error.response?.data.error ||
        "An unknown error occurred.";

      addAlert("error", "Error", errorMessage);
    }
  }

  function addAlert(severity, title, message) {
    setAlerts((prevAlerts) => [...prevAlerts, { severity, title, message }]);
  }

  function handleAlertClose(index) {
    setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md">
        <DialogTitle>{taskList?.title}</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2}>
            {tasks.map((task) => (
              <TaskDetail
                key={task.id}
                task={task}
                handleToggle={() => handleTaskChange(task.id, "toggle")}
                handleEditStart={() => {
                  setOriginalTaskValue(task.task_description);
                  setEditValue(task.task_description);
                  setTasks((prevTasks) =>
                    prevTasks.map((t) =>
                      t.id === task.id ? { ...t, isEditing: true } : t
                    )
                  );
                }}
                handleEdit={() => handleTaskChange(task.id, "edit", editValue)}
                handleDelete={handleDelete}
                editValue={editValue}
                setEditValue={setEditValue}
              />
            ))}

            <NewTaskInput
              newTask={newTask}
              setNewTask={setNewTask}
              handleAddTask={handleAddTask}
            />
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: "#0A6AE2" }}>
            Close
          </Button>
          <Button
            onClick={() => handleDeleteTaskList(taskList.id)}
            sx={{ color: "#DA4646" }}
          >
            Delete Task List
          </Button>
        </DialogActions>
      </Dialog>

      <AlertList alerts={alerts} onClose={handleAlertClose} />
    </>
  );
}

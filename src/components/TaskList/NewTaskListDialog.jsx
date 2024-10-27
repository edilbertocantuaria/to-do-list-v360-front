/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid2
} from "@mui/material";
import NewTaskInput from "../tasks/NewTaskInput";
import TaskAttachment from "./TaskAttachment";
import api from "../../services/api";
import AlertList from "../AlertList";
import useReload from "../../hooks/useReload";
import TaskDetail from "../tasks/TaskDetail";

export default function NewTaskListDialog({ open, onClose, auth }) {
  const [title, setTitle] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [previousTitle, setPreviousTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(true);

  const [tasks, setTasks] = useState([""]);
  const [taskList, setTaskList] = useState(null);

  const [newTask, setNewTask] = useState("");
  const [originalTaskValue, setOriginalTaskValue] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");

  const [isEditingFile, setIsEditingFile] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const [taskListId, setTaskListId] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const [taskInputs, setTaskInputs] = useState([
    <NewTaskInput
      newTask={newTask}
      setNewTask={setNewTask}
      handleAddTask={handleAddTask}
      add
    />
  ]);

  const { setShouldReload } = useReload();

  function originalState() {
    // setTitle("");
    setIsEditingFile(false);
    setAttachmentUrl("");
    setTasks([]);
    setIsEditingTitle(false);
  }

  useEffect(() => {
    if (taskList && taskList.tasks) {
      setTasks(taskList.tasks);
    }
  }, [taskList]);

  useEffect(() => {
    if (!open) {
      setNewTask("");
    }
  }, [open]);

  async function loadTasks() {
    try {
      const response = await api.getTaskList(taskListId, auth.token);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  }

  async function handleAddTaskLists(title) {
    if (title.trim()) {
      const body = {
        title: title.trim(),
        attachment: attachmentUrl || null
      };

      try {
        const response = await api.postTaskList(body, auth.token);
        setTaskList(response.data);
        setTaskListId(response.data.idTaskList);
        setTaskTitle(response.data.titleTask);
        setIsEditingTitle(false);
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

  async function handleAddTask(newTask) {
    if (newTask.trim()) {
      const newTaskObj = {
        task_description: newTask.trim()
      };

      try {
        const response = await api.postTask(taskListId, newTaskObj, auth.token);
        setTasks([...tasks, ""]);
        setNewTask("");
        loadTasks();
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

  async function handleEditTaskList() {
    try {
      const body = {
        title: title,
        attachment: attachmentUrl
      };

      await api.putTaskList(taskList.id, body, auth.token);
      setShouldReload(true);
      setIsEditingTitle(false);
    } catch (error) {
      setTitle(previousTitle);
      const errorMessage =
        error.response?.data.errors ||
        error.response?.data.error ||
        "An unknown error occurred.";
      addAlert("error", "Error", errorMessage);
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
          setEditTaskDescription(taskDescription);
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

  function handleAddNewTaskInput() {
    setTaskInputs([
      ...taskInputs,
      <NewTaskInput
        newTask={newTask}
        setNewTask={setNewTask}
        handleAddTask={handleAddTask}
      />
    ]);
  }

  function addAlert(severity, title, message) {
    setAlerts((prevAlerts) => [...prevAlerts, { severity, title, message }]);
  }

  function handleAlertClose(index) {
    setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
  }

  function handleCloseDialog() {
    setTitle("");
    setTaskTitle("");
    setIsEditingTitle(true);
    setTaskListId(null);
    setNewTask("");
    onClose();
  }
  return (
    <>
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md">
        <DialogContent>
          <Grid2 container spacing={2}>
            <TextField
              autoFocus
              margin="dense"
              label="Task List Title"
              type="text"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid2>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} sx={{ mt: 1 }}>
              {tasks.map((task, index) => (
                <NewTaskInput
                  key={index}
                  newTask={task}
                  setNewTask={(updatedTask) => {
                    const newTasks = [...tasks];
                    newTasks[index] = updatedTask;
                    setTasks(newTasks);
                  }}
                  handleAddTask={handleAddTask}
                />
              ))}
            </Grid2>
          </Grid2>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} sx={{ mt: 3 }}>
              <TaskAttachment
                isEditingFile={isEditingFile}
                setIsEditingFile={setIsEditingFile}
                setAttachmentUrl={setAttachmentUrl}
              />
            </Grid2>
          </Grid2>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: "#DA4646" }}>
            Cancel
          </Button>
          <Button
            onClick={() => handleAddTaskLists(title)}
            sx={{ color: "#0A69DD" }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <AlertList alerts={alerts} onClose={handleAlertClose} />
    </>
  );
}

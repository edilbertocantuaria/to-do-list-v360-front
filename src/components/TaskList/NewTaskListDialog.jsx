import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid
} from "@mui/material";
import NewTaskInput from "../tasks/NewTaskInput";

export default function NewTaskListDialog({ open, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [newTask, setNewTask] = useState("");

  const handleCreate = () => {
    if (title.trim()) {
      onCreate(title);
      setTitle("");
    }
  };

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
      <DialogTitle>{taskTitle}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Task List Title"
              type="text"
              fullWidth
              variant="outlined"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ mt: 3 }}>
          <NewTaskInput
            newTask={newTask}
            setNewTask={setNewTask}
            handleAddTask={handleAddTask}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#0A6AE2" }}>
          Cancel
        </Button>
        <Button onClick={handleCreate} sx={{ color: "#0A69DD" }}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

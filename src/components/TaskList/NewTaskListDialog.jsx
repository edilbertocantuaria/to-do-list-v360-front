import { useState } from "react";
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

export default function NewTaskListDialog({ open, onClose, auth }) {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([""]);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [isEditingFile, setIsEditingFile] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { setShouldReload } = useReload();

  function originalState() {
    setTitle("");
    setTasks([""]);
    setAttachmentUrl("");
    setIsEditingFile(false);
  }

  async function handleAddTask(newTask) {
    if (newTask.trim()) {
      setTasks([...tasks, ""]);
    }
  }

  async function handleAddTaskLists() {
    const body = {
      task_list: {
        title: title.trim(),
        attachment: attachmentUrl || null,
        tasks_attributes: tasks
          .filter((task) => task.trim() !== "")
          .map((task) => ({
            task_description: task.trim()
          }))
      }
    };

    try {
      await api.postTaskList(body, auth.token);
      setShouldReload(true);
      originalState();
      onClose();
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

  function handleCancel() {
    hasInfo ? setOpenConfirmDialog(true) : onClose();
  }

  function handleConfirmCancel() {
    setOpenConfirmDialog(false);
    originalState();
    onClose();
  }

  function handleCloseConfirm() {
    setOpenConfirmDialog(false);
  }
  const hasInfo =
    open &&
    (title?.trim() ||
      tasks?.some((task) => task.trim()) ||
      attachmentUrl?.trim());

  return (
    <>
      <Dialog open={open} onClose={handleCancel} maxWidth="md">
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
                  isNewTaskDialog={true}
                />
              ))}
            </Grid2>
          </Grid2>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} sx={{ mt: 3 }}>
              <TaskAttachment
                isEditingFile={isEditingFile}
                setAttachmentUrl={setAttachmentUrl}
              />
            </Grid2>
          </Grid2>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel} sx={{ color: "#DA4646" }}>
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

      {hasInfo && (
        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirm}
          aria-labelledby="confirm-cancel-dialog"
        >
          <DialogTitle id="confirm-cancel-dialog">Confirm Cancel</DialogTitle>
          <DialogContent>
            All information will be lost. Do you want to proceed?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm} sx={{ color: "#DA4646" }}>
              Back
            </Button>
            <Button onClick={handleConfirmCancel} sx={{ color: "#0A69DD" }}>
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <AlertList alerts={alerts} onClose={handleAlertClose} />
    </>
  );
}

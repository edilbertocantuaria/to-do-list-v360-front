import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid2
} from "@mui/material";
import NewTaskInput from "../tasks/NewTaskInput";
import TaskAttachment from "./TaskAttachment";
import ConfirmLeaveDialog from "../sharedComponents/ConfirmLeaveDialog";
import api from "../../services/api";
import AlertList from "../sharedComponents/AlertList";
import useReload from "../../hooks/useReload";
import TagsChoice from "../tags/TagsChoice";

export default function NewTaskListDialog({ open, onClose, myTags, auth }) {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([""]);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [isEditingFile, setIsEditingFile] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [tagId, setTagId] = useState(null);
  const { setShouldReload } = useReload();

  function originalState() {
    setTitle("");
    setTasks([""]);
    setAttachmentUrl("");
    setIsEditingFile(false);
    setSelectedTag("");
    setNewTag("");
  }

  async function handleAddTask(newTask) {
    if (newTask.trim()) {
      setTasks([...tasks, ""]);
    }
  }

  async function handleAddTaskLists() {
    let tagIdToUse = tagId;

    if (selectedTag && !myTags.some((tag) => tag.tagName === selectedTag)) {
      try {
        tagIdToUse = await handleAddTag(selectedTag);

        setTagId(tagIdToUse);
      } catch (error) {
        addAlert("error", "Error", "Erro ao criar a nova tag.");
        return;
      }
    }

    const body = {
      task_list: {
        title: title.trim(),
        attachment: attachmentUrl || null,
        tag_id: tagId || null,
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

  async function handleAddTag(tagValue) {
    if (tagValue) {
      const body = { tag_name: tagValue.trim() };
      try {
        setLoading(true);
        const response = await api.postTag(body, auth.token);
        setTagId(response.data.idTag);
        setSelectedTag(response.data.tagName);
        setLoading(false);
        setShouldReload(true);
      } catch (error) {
        const errorMessage =
          error.response?.data.errors ||
          error.response?.data.error ||
          "An unknown error occurred.";
        setLoading(false);
        addAlert("error", "Error", errorMessage);
      }
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

  function handleCloseCancel() {
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
      attachmentUrl?.trim() ||
      selectedTag ||
      newTag);

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
                />
              ))}
            </Grid2>
          </Grid2>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} sx={{ mt: 3 }}>
              <TaskAttachment
                isEditingFile={isEditingFile}
                setIsEditingFile={setIsEditingFile}
                attachmentUrl={attachmentUrl} 
                setAttachmentUrl={setAttachmentUrl}
                isNewTaskListDialog={true}
              />
            </Grid2>
          </Grid2>
          <TagsChoice
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            loading={loading}
            setTagId={setTagId}
            myTags={myTags}
            handleAddTag={handleAddTag}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseCancel} sx={{ color: "#DA4646" }}>
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
        <ConfirmLeaveDialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
          onClickConfirm={handleCloseConfirm}
          onClickCancel={() => setOpenConfirmDialog(false)}
        />
      )}

      <AlertList alerts={alerts} onClose={handleAlertClose} />
    </>
  );
}

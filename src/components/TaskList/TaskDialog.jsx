import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid2,
  TextField
} from "@mui/material";
import { useState, useEffect } from "react";
import TaskDetail from "../tasks/TaskDetail";
import NewTaskInput from "../tasks/NewTaskInput";
import TaskAttachment from "./TaskAttachment";
import TagsChoice from "../tags/TagsChoice";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import useReload from "../../hooks/useReload";
import useMyTasksList from "../../hooks/useMyTaskLists";
import AlertList from "../sharedComponents/AlertList";

export default function TaskDialog({
  open,
  setOpen,
  taskList,
  onClose,
  isEditingFile,
  setIsEditingFile
}) {
  const [tasks, setTasks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [newTask, setNewTask] = useState("");

  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [originalTaskValue, setOriginalTaskValue] = useState("");

  const [attachmentUrl, setAttachmentUrl] = useState(
    taskList?.attachment || ""
  );
  const previousAttachmentUrl = taskList?.attachment || "";

  const [title, setTitle] = useState(taskList?.title || "");
  const [newTitle, setNewTitle] = useState(title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [auxTitle, setAuxTitle] = useState(title);

  const [loading, setLoading] = useState(false);

  const [selectedTag, setSelectedTag] = useState("");
  const [tagId, setTagId] = useState(taskList?.idTag || null);
  const { myTags } = useMyTasksList();

  const { auth } = useAuth();
  const { setShouldReload } = useReload();

  useEffect(() => {
    if (taskList && taskList.tasks) {
      setTasks(taskList.tasks);
      setTagId(taskList.idTag);
    }
  }, [taskList]);

  useEffect(() => {
    if (!open) {
      setNewTask("");
      setSelectedTag("");
      setTagId(null);
    }
  }, [open]);

  function originalState() {
    setTasks([]);
    setAlerts([]);
    setNewTask("");

    setEditTaskDescription("");
    setOriginalTaskValue("");

    setAttachmentUrl(taskList?.attachment || "");

    setTitle(taskList?.title || "");
    setIsEditingTitle(false);
    setAuxTitle(title);
  }

  async function handleAddTask() {
    if (newTask.trim()) {
      const newTaskObj = {
        tasks: [
          {
            task_description: newTask
          }
        ]
      };

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
        return response.data;
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

  async function handleEditTaskList(taskList, newTitle) {
    try {
      setIsEditingFile(false);
      setIsEditingTitle(false);

      const body = {
        title: newTitle,
        attachment: attachmentUrl,
        tag_id: tagId
      };

      const response = await api.putTaskList(taskList.id, body, auth.token);
      setShouldReload(true);
      setTitle(response.data.title);
      setNewTitle("");
    } catch (error) {
      const errorMessage =
        error.response?.data.errors ||
        error.response?.data.error ||
        "An unknown error occurred.";

      setTitle(auxTitle);
      setAttachmentUrl(previousAttachmentUrl);
      addAlert("error", "Error", errorMessage);
    }
  }

  function addAlert(severity, title, message) {
    setAlerts((prevAlerts) => [...prevAlerts, { severity, title, message }]);
  }

  function handleAlertClose(index) {
    setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
  }

  function handleCloseDialog() {
    originalState();
    setSelectedTag(null);
    onClose();
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md">
        {isEditingTitle ? (
          <TextField
            type="text"
            variant="outlined"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={() => {
              originalState();
              setIsEditingTitle(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEditTaskList(taskList, newTitle);
              }
            }}
            label="New Task List Title"
            autoFocus
            sx={{ mt: 4, ml: 2, mr: 2 }}
          />
        ) : (
          <DialogTitle onClick={() => setIsEditingTitle(true)}>
            {taskList?.title}
          </DialogTitle>
        )}
        <DialogContent>
          <Grid2 container spacing={2}>
            {tasks.map((task) => (
              <TaskDetail
                key={task.id}
                task={task}
                handleToggle={() => handleTaskChange(task.id, "toggle")}
                handleEditStart={() => {
                  setOriginalTaskValue(task.task_description);
                  setEditTaskDescription(task.task_description);
                  setTasks((prevTasks) =>
                    prevTasks.map((t) =>
                      t.id === task.id ? { ...t, isEditing: true } : t
                    )
                  );
                }}
                handleEdit={() =>
                  handleTaskChange(task.id, "edit", editTaskDescription)
                }
                handleDelete={handleDelete}
                editValue={editTaskDescription}
                setEditValue={setEditTaskDescription}
              />
            ))}
            <NewTaskInput
              newTask={newTask}
              setNewTask={setNewTask}
              handleAddTask={handleAddTask}
            />

            <TaskAttachment
              taskList={taskList}
              isEditingFile={isEditingFile}
              setIsEditingFile={setIsEditingFile}
              attachmentUrl={attachmentUrl}
              setAttachmentUrl={setAttachmentUrl}
              handleEditTaskList={handleEditTaskList}
            />

            <TagsChoice
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              loading={loading}
              setTagId={setTagId}
              myTags={myTags}
              handleAddTag={handleAddTag}
              taskList={taskList}
              isTaskDialog={true}
              handleEditTaskList={handleEditTaskList}
            />
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDeleteTaskList(taskList.id)}
            sx={{ color: "#DA4646" }}
          >
            Delete Task List
          </Button>

          <Button onClick={handleCloseDialog} sx={{ color: "#0A6AE2" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <AlertList alerts={alerts} onClose={handleAlertClose} />
    </>
  );
}

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Typography,
  Tooltip,
  Grid2
} from "@mui/material";
import useReload from "../../hooks/useReload";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";
import AddTaskIcon from "@mui/icons-material/AddTask";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

export default function TagManager({ myTags }) {
  const [open, setOpen] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newTag, setNewTag] = useState("");
  const { setShouldReload } = useReload();
  const { auth } = useAuth();

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setEditValue("");
    setEditingId(null);
    setNewTag("");
  }

  async function handleEdit(id) {
    try {
      await api.putTag(id, { tag_name: editValue }, auth.token);
      setShouldReload(true);
      setEditingId(null);
    } catch (error) {
      const errorMessage =
        error.response?.data.errors ||
        error.response?.data.error ||
        "An unknown error occurred.";
      return errorMessage;
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteTag(id, auth.token);
      setShouldReload(true);
    } catch (error) {
      const errorMessage =
        error.response?.data.errors ||
        error.response?.data.error ||
        "An unknown error occurred.";
      return errorMessage;
    }
  }

  async function handleAddTag() {
    if (newTag.trim()) {
      const body = { tag_name: newTag.trim() };
      try {
        const response = await api.postTag(body, auth.token);
        setNewTag("");
        setShouldReload(true);
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data.errors ||
          error.response?.data.error ||
          "An unknown error occurred.";
        return errorMessage;
      }
    }
  }

  return (
    <>
      <Tooltip title="Tag Manager">
        <Button variant="outlined" onClick={handleOpen} sx={{ height: "35px" }}>
          Tag Manager
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>Manage Your Tags</DialogTitle>
        <DialogContent dividers>
          {myTags.map((tag) => (
            <Grid2
              container
              key={tag.idTag}
              alignItems="center"
              justifyContent="space-between"
              sx={{ mt: 2 }}
            >
              <Grid2 item xs={8}>
                {editingId === tag.idTag ? (
                  <TextField
                    fullWidth
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleEdit(tag.idTag)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEdit(tag.idTag);
                    }}
                  />
                ) : (
                  <Typography variant="body1">{tag.tagName}</Typography>
                )}
              </Grid2>

              <Grid2 item>
                <Tooltip title="Edit tag">
                  <IconButton
                    onClick={() => {
                      setEditValue(tag.tagName);
                      setEditingId(tag.idTag);
                    }}
                    sx={{ color: "#0769A8" }}
                  >
                    <CreateOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete tag">
                  <IconButton onClick={() => handleDelete(tag.idTag)}>
                    <DeleteForeverOutlinedIcon sx={{ color: "#DA4646" }} />
                  </IconButton>
                </Tooltip>
              </Grid2>
            </Grid2>
          ))}

          <Grid2 item xs={12} sx={{ mt: "1.5vh" }}>
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
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddTag(newTag);
                        }
                      }}
                      sx={{ marginBottom: 2, width: "50vw" }}
                    />
                  </Grid2>
                </Grid2>
              </Grid2>

              <Grid2
                item
                sx={{ position: "absolute", right: 0, display: "flex", gap: 1 }}
              >
                <Tooltip title="Add tag">
                  <IconButton
                    onClick={() => handleAddTag(newTag)}
                    sx={{ color: "#109DCB" }}
                  >
                    <AddTaskIcon />
                  </IconButton>
                </Tooltip>
              </Grid2>
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

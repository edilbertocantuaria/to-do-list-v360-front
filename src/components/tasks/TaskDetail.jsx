import {
  Typography,
  Switch,
  TextField,
  Grid2,
  Tooltip,
  IconButton
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

export default function TaskDetail({
  task,
  handleToggle,
  handleEdit,
  handleDelete,
  handleEditStart,
  editValue,
  setEditValue
}) {
  return (
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
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#FD7E00" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#FD7E00"
                  }
                }}
              />
            </Grid2>
            <Grid2 item>
              {task.isEditing ? (
                <TextField
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleEdit(task.id)}
                  sx={{ width: "46.16vw" }}
                />
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    textDecoration: task.is_task_done ? "line-through" : "none",
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
          sx={{ position: "absolute", right: 0, display: "flex", gap: 1 }}
        >
          <Tooltip title="Edit task">
            <IconButton
              onClick={() => handleEditStart(task.id, task.task_description)}
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
  );
}

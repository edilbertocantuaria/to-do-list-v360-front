import { TextField, Grid2, Tooltip, IconButton } from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";

export default function NewTaskInput({ newTask, setNewTask, handleAddTask }) {
  return (
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddTask(newTask);
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
          <Tooltip title="Add task">
            <IconButton
              onClick={() => handleAddTask(newTask)}
              sx={{ color: "#109DCB" }}
            >
              <AddTaskIcon />
            </IconButton>
          </Tooltip>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

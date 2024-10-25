import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Switch
} from "@mui/material";

export default function TaskDialog({ open, taskList, onClose }) {
  const handleToggle = (taskId) => {
    taskList.tasks = taskList.tasks.map((task) =>
      task.id === taskId ? { ...task, is_task_done: !task.is_task_done } : task
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{taskList?.title}</DialogTitle>
      <DialogContent>
        {taskList?.tasks.map((task) => (
          <div key={task.id} style={{ display: "flex", alignItems: "center" }}>
            <Switch
              checked={task.is_task_done}
              onChange={() => handleToggle(task.id)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#FD7E00"
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#FD7E00"
                }
              }}
            />
            <Typography
              variant="body1"
              sx={{
                textDecoration: task.is_task_done ? "line-through" : "none",
                fontStyle: task.is_task_done ? "italic" : "normal",
                marginLeft: 1
              }}
            >
              {task.task_description}
            </Typography>
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

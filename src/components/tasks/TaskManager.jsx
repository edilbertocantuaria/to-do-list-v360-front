import { useState } from "react";
import NewTaskInput from "./NewTaskInput";
import { Grid2, IconButton } from "@mui/material";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

export default function TaskManager() {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (task) => {
    if (task) {
      setTasks((prevTasks) => [...prevTasks, task]);
      setNewTask("");
    }
  };

  return (
    <div>
      <NewTaskInput
        newTask={newTask}
        setNewTask={setNewTask}
        handleAddTask={handleAddTask}
      />
      <Grid2 container direction="column" spacing={1}>
        {tasks.map((task, index) => (
          <Grid2 item key={index}>
            <IconButton>
              <CheckOutlinedIcon />
            </IconButton>
            {task}
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
}

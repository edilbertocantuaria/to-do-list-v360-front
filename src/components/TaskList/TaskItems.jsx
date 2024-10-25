import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

export default function TaskItems({ tasks }) {
  const [taskList, setTaskList] = useState(tasks);

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  const sortedTasks = taskList.tasks.sort(
    (a, b) => a.is_task_done - b.is_task_done
  );

  return sortedTasks.slice(0, 3).map((task) => (
    <Box
      key={task.id}
      display="flex"
      alignItems="center"
      sx={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
      }}
    >
      <Typography
        variant="body1"
        sx={{
          textDecoration: task.is_task_done ? "line-through" : "none",
          fontStyle: task.is_task_done ? "italic" : "normal",
          marginLeft: 1,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis"
        }}
      >
        <li>{task.task_description}</li>
      </Typography>
    </Box>
  ));
}

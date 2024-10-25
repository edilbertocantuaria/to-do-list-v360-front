/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Typography, Switch, Box } from "@mui/material";

export default function TaskItems({ tasks }) {
  // Altere taskList para tasks
  const [taskList, setTaskList] = useState(tasks); // Inicializa o estado com as tarefas

  useEffect(() => {
    setTaskList(tasks); // Atualiza o estado sempre que as tasks mudam
  }, [tasks]);
  console.log(tasks);
  const sortedTasks = taskList.tasks.sort(
    (a, b) => a.is_task_done - b.is_task_done
  );

  function handleToggle(taskId) {
    // Atualiza o estado das tarefas
    const updatedTasks = taskList.tasks.map((task) =>
      task.id === taskId
        ? { ...task, is_task_done: !task.is_task_done } // Alterna o estado
        : task
    );

    // Atualiza o estado do componente
    setTaskList({ ...taskList, tasks: updatedTasks });
  }

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

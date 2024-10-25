import { useState } from "react";
import { Box, Typography } from "@mui/material";
import TaskCard from "./TaskCard";
import TaskDialog from "./TaskDialog";

export default function TaskList({ myTaskLists }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTaskList, setSelectedTaskList] = useState(null);

  const handleCardClick = (taskList) => {
    setSelectedTaskList(taskList);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTaskList(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#EEEEEE",
        mt: "20px",
        mb: "20px",
        ml: "1.5px",
        pt: 2,
        pb: 2,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        gap: "20px"
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h6"
          sx={{
            mb: 1.5,
            mt: -2,
            bgcolor: "#FD7E00",
            display: "flex",
            justifyContent: "center",
            color: "#FFFFFF",
            borderRadius: "16px"
          }}
        >
          Pendings
        </Typography>
      </Box>
      {myTaskLists
        .filter((taskList) => taskList.percentage < 100)
        .sort((a, b) => a.percentage - b.percentage)
        .map((taskList) => (
          <TaskCard
            key={taskList.id}
            taskList={taskList}
            onClick={handleCardClick}
          />
        ))}

      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h6"
          sx={{
            mb: 1.5,
            mt: -2,
            bgcolor: "#0769A8",
            display: "flex",
            justifyContent: "center",
            color: "#FFFFFF",
            borderRadius: "16px"
          }}
        >
          Concluded
        </Typography>
      </Box>
      {myTaskLists
        .filter((taskList) => taskList.percentage === 100)
        .map((taskList) => (
          <TaskCard
            key={taskList.id}
            taskList={taskList}
            onClick={handleCardClick}
          />
        ))}

      <TaskDialog
        open={dialogOpen}
        taskList={selectedTaskList}
        onClose={handleDialogClose}
      />
    </Box>
  );
}

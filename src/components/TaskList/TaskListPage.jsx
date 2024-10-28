import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import TaskCard from "./TaskCard";
import TaskDialog from "./TaskDialog";
import TaskFilter from "./TaskFilter";
import useReload from "../../hooks/useReload";

export default function TaskListPage({ myTaskLists, myTags }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTaskList, setSelectedTaskList] = useState(null);
  const { openedTaskList, setOpenedTaskList } = useReload();
  const [isEditingFile, setIsEditingFile] = useState(false);
  const [filteredTaskLists, setFilteredTaskLists] = useState(myTaskLists);

  useEffect(() => {
    if (openedTaskList) {
      const taskList = myTaskLists.find((list) => list.id === openedTaskList);
      setSelectedTaskList(taskList || null);
    } else {
      setSelectedTaskList(null);
    }
  }, [openedTaskList, myTaskLists]);

  useEffect(() => {
    if (openedTaskList) {
      const taskList = myTaskLists.find((list) => list.id === openedTaskList);
      if (taskList !== selectedTaskList) {
        setSelectedTaskList(taskList || null);
      }
    } else if (selectedTaskList !== null) {
      setSelectedTaskList(null);
    }
  }, [openedTaskList, myTaskLists, selectedTaskList, myTags]);

  function handleCardClick(taskList) {
    setOpenedTaskList(taskList.id);
    setSelectedTaskList(taskList);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setIsEditingFile(false);
    setOpenedTaskList(null);
    setDialogOpen(false);
    setSelectedTaskList(null);
  }

  function handleFilterChange(selectedFilter) {
    let sortedTasks = [...myTaskLists];

    switch (selectedFilter) {
      case "progressAsc":
        sortedTasks.sort(
          (a, b) =>
            a.percentage - b.percentage || a.title.localeCompare(b.title)
        );
        break;
      case "progressDesc":
        sortedTasks.sort(
          (a, b) =>
            b.percentage - a.percentage || a.title.localeCompare(b.title)
        );
        break;
      case "createdAsc":
        sortedTasks.sort(
          (a, b) =>
            new Date(a.created_at) - new Date(b.created_at) ||
            a.title.localeCompare(b.title)
        );
        break;
      case "createdDesc":
        sortedTasks.sort(
          (a, b) =>
            new Date(b.created_at) - new Date(a.created_at) ||
            a.title.localeCompare(b.title)
        );
        break;
      case "modifiedAsc":
        sortedTasks.sort(
          (a, b) =>
            new Date(a.updated_at) - new Date(b.updated_at) ||
            a.title.localeCompare(b.title)
        );
        break;
      case "modifiedDesc":
        sortedTasks.sort(
          (a, b) =>
            new Date(b.updated_at) - new Date(a.updated_at) ||
            a.title.localeCompare(b.title)
        );
        break;
      case "alphabeticalAsc":
        sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "alphabeticalDesc":
        sortedTasks.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "taskCountAsc":
        sortedTasks.sort(
          (a, b) =>
            a.tasks.length - b.tasks.length || a.title.localeCompare(b.title)
        );
        break;
      case "taskCountDesc":
        sortedTasks.sort(
          (a, b) =>
            b.tasks.length - a.tasks.length || a.title.localeCompare(b.title)
        );
        break;
      default:
        break;
    }

    if (JSON.stringify(sortedTasks) !== JSON.stringify(filteredTaskLists)) {
      setFilteredTaskLists(sortedTasks);
    }
  }

  const pendingTaskLists = filteredTaskLists.filter(
    (taskList) => taskList.percentage < 100
  );
  const concludedTaskLists = filteredTaskLists.filter(
    (taskList) => taskList.percentage === 100
  );

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
      <TaskFilter onFilterChange={handleFilterChange} />

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
      {pendingTaskLists.map((taskList) => (
        <TaskCard
          key={taskList.id}
          taskList={taskList}
          myTags={myTags}
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
      {concludedTaskLists.map((taskList) => (
        <TaskCard
          key={taskList.id}
          taskList={taskList}
          myTags={myTags}
          onClick={handleCardClick}
        />
      ))}
      <TaskDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        taskList={selectedTaskList}
        onClose={handleDialogClose}
        isEditingFile={isEditingFile}
        setIsEditingFile={setIsEditingFile}
      />
    </Box>
  );
}

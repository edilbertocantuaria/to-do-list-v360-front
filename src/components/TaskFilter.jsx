import { useState, useEffect } from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";

export default function TaskFilter({ onFilterChange }) {
  const [filter, setFilter] = useState("progressAsc");

  function handleFilterChange(event) {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
    onFilterChange(selectedFilter);
  }

  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  return (
    <Box
      sx={{
        mt: -2,
        mb: 2,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "100%"
      }}
    >
      <Typography variant="subtitle1" sx={{ mr: 1 }}>
        Filter Tasks
      </Typography>
      <Select
        value={filter}
        onChange={handleFilterChange}
        displayEmpty
        sx={{ minWidth: 120, mt: 1, fontSize: "0.875rem" }}
      >
        <MenuItem value="progressAsc">Progress (Asc)</MenuItem>
        <MenuItem value="progressDesc">Progress (Desc)</MenuItem>
        <MenuItem value="createdDesc">Last Created</MenuItem>
        <MenuItem value="createdAsc">First created</MenuItem>
        <MenuItem value="modifiedDesc">Last Modified</MenuItem>
        <MenuItem value="modifiedAsc">First Modified</MenuItem>
        <MenuItem value="alphabeticalAsc">Alphabetical Order (Asc)</MenuItem>
        <MenuItem value="alphabeticalDesc">Alphabetical Order (Desc)</MenuItem>
        <MenuItem value="taskCountAsc">Number of Tasks (Asc)</MenuItem>
        <MenuItem value="taskCountDesc">Number of Tasks (Desc)</MenuItem>
      </Select>
    </Box>
  );
}

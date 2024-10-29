import { Box, Card, CardContent, CardHeader, Chip } from "@mui/material";

import TaskItems from "./TaskItems";
import TaskProgress from "./TaskProgress";

export default function TaskCard({ taskList, myTags, onClick }) {
  const tag = myTags.find((tagItem) => tagItem.idTag === taskList.tag_id);
  return (
    <Box
      sx={{ width: "400px", height: "200px", position: "relative", mb: "35px" }}
    >
      <Card
        onClick={() => onClick(taskList)}
        sx={{
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          boxShadow: 3,
          height: "100%",
          justifyContent: "space-between"
        }}
      >
        <CardHeader
          title={taskList.title}
          action={
            tag && (
              <Chip
                label={tag.tagName}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  width: "30vw",
                  "@media (min-width: 810px)": {
                    width: "10vw"
                  }
                }}
              />
            )
          }
        />
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100px"
          }}
        >
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <TaskItems tasks={taskList} />
          </Box>
          <Box sx={{ position: "relative", display: "inline-flex", ml: 2 }}>
            <TaskProgress value={taskList.percentage} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

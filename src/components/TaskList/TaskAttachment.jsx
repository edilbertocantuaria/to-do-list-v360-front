import { Box, Grid2, Switch, TextField } from "@mui/material";

export default function TaskAttachment({
  taskList,
  isEditingFile,
  setIsEditingFile,
  attachmentUrl,
  setAttachmentUrl,
  handleEditTaskList
}) {
  setAttachmentUrl(taskList?.attachment || "");
  return (
    <>
      <Grid2 item xs={12}>
        <Grid2
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{ position: "relative" }}
        >
          <Grid2 item width={875}>
            <Grid2 container alignItems="center">
              {taskList?.attachment ? (
                <Box
                  component="embed"
                  src={taskList.attachment}
                  width="100%"
                  height="300px"
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    mb: 2
                  }}
                />
              ) : (
                <p>No related files.</p>
              )}
            </Grid2>
          </Grid2>
        </Grid2>

        <Grid2 container alignItems="center" spacing={1} sx={{ mt: 1 }}>
          <Grid2 item>
            <Switch
              checked={isEditingFile}
              onChange={() => setIsEditingFile((prev) => !prev)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#FD7E00" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#FD7E00"
                }
              }}
            />
          </Grid2>
          <Grid2 item>Editing file URL</Grid2>
          {isEditingFile && (
            <Grid2 item width={875}>
              <TextField
                label="File URL"
                variant="outlined"
                fullWidth
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                onBlur={() => {
                  handleEditTaskList(taskList), setIsEditingFile(false);
                }}
                sx={{ width: "50vw" }}
              />
            </Grid2>
          )}
        </Grid2>
      </Grid2>
    </>
  );
}

import {
  TextField,
  Autocomplete,
  Grid2,
  CircularProgress
} from "@mui/material";
import { useEffect } from "react";

export default function TagsChoice({
  selectedTag,
  setSelectedTag,
  loading,
  setTagId,
  myTags,
  handleAddTag,
  taskList,
  handleEditTaskList,
  isTaskDialog
}) {
  useEffect(() => {
    if (isTaskDialog && taskList) {
      const initialTag = myTags.find((tag) => tag.idTag === taskList.tag_id);
      if (initialTag) {
        setSelectedTag(initialTag.tagName);
        setTagId(initialTag.idTag);
      } else {
        setSelectedTag("");
        setTagId(null);
      }
    }
  }, [isTaskDialog, taskList, myTags, setSelectedTag, setTagId]);

  const sortedTags = myTags
    .slice()
    .sort((a, b) => a.tagName.localeCompare(b.tagName));

  return (
    <Grid2 item xs={12} sx={{ mt: 5, width: "35%" }}>
      <Autocomplete
        freeSolo={isTaskDialog}
        value={selectedTag}
        onInputChange={(event, newInputValue) => {
          if (isTaskDialog) {
            setSelectedTag(newInputValue);
          }
        }}
        onBlur={async (event) => {
          const tagValue = event.target.value.trim();
          const existingTag = myTags.find((tag) => tag.tagName === tagValue);

          if (existingTag) {
            setTagId(existingTag.idTag);
            setSelectedTag(existingTag.tagName);
          } else if (tagValue) {
            const newTag = await handleAddTag(tagValue);
            setSelectedTag(newTag.tag_name);
            setTagId(newTag.idTag);
          } else {
            setTagId(null);
          }

          if (isTaskDialog) {
            await handleEditTaskList(taskList, taskList?.title);
          }
        }}
        onChange={async (event, newValue) => {
          setSelectedTag(newValue || "");
          const existingTag = myTags.find((tag) => tag.tagName === newValue);

          if (existingTag) {
            setTagId(existingTag.idTag);
          } else if (newValue) {
            const createdTag = await handleAddTag(newValue);
            setSelectedTag(createdTag.tag_name);
            setTagId(createdTag.idTag);
          }
        }}
        options={sortedTags.map((tag) => tag.tagName)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tags"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
      />
    </Grid2>
  );
}

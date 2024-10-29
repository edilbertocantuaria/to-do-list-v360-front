import {
  TextField,
  Autocomplete,
  Grid2,
  CircularProgress
} from "@mui/material";
import { useEffect, useState } from "react";

export default function TagsChoice({
  selectedTag,
  setSelectedTag,
  loading,
  setTagId,
  myTags,
  handleAddTag,
  taskList,
  isTaskDialog,
  handleEditTaskList
}) {
  const [localTags, setLocalTags] = useState(myTags || []);

  useEffect(() => {
    setLocalTags(myTags);
  }, [myTags]);

  useEffect(() => {
    if (isTaskDialog && taskList) {
      const initialTag = localTags.find((tag) => tag.idTag === taskList.tag_id);
      if (initialTag) {
        setSelectedTag(initialTag.tagName);
        setTagId(initialTag.idTag);
      } else {
        setSelectedTag("");
        setTagId(null);
      }
    }
  }, [isTaskDialog, taskList, localTags, setSelectedTag, setTagId]);

  async function handleNewTag(tagValue) {
    if (tagValue) {
      const newTag = await handleAddTag(tagValue);
      if (newTag) {
        setLocalTags((prevTags) => [
          ...prevTags,
          { idTag: newTag.idTag, tagName: newTag.tag_name }
        ]);
        setSelectedTag(newTag.tag_name);
        setTagId(newTag.idTag);
      }
    }
  }

  function handleInputChange(event, newInputValue) {
    if (isTaskDialog) {
      setSelectedTag(newInputValue);
    }
  }

  async function handleBlur(event) {
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
  }

  function handleChange(event, newValue) {
    const selectedValue = newValue || "";
    setSelectedTag(selectedValue);

    if (selectedValue === "") {
      setTagId(null);
    } else {
      const existingTag = localTags.find(
        (tag) => tag.tagName === selectedValue
      );
      if (existingTag) {
        setTagId(existingTag.idTag);
      } else {
        handleNewTag(selectedValue);
      }
    }
  }

  const sortedTags = localTags
    .slice()
    .sort((a, b) => a.tagName.localeCompare(b.tagName));

  return (
    <Grid2 item xs={12} sx={{ mt: 5, width: "35%" }}>
      <Autocomplete
        value={selectedTag}
        onInputChange={handleInputChange}
        onBlur={handleBlur}
        onChange={handleChange}
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

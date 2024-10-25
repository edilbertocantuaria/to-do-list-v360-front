import { Box, CircularProgress, Typography } from "@mui/material";

export default function TaskProgress({ value }) {
  return (
    <>
      <CircularProgress variant="determinate" value={value} size={50} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(value)}%`}</Typography>
      </Box>
    </>
  );
}

import { useEffect } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

const AlertList = ({ alerts, onClose }) => {
  useEffect(() => {
    const timers = alerts.map((_, index) => {
      return setTimeout(() => {
        onClose(index);
      }, 5000);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [alerts, onClose]);

  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      {alerts.map((alert, index) => (
        <Alert
          key={index}
          severity={alert.severity}
          onClose={() => onClose(index)}
          variant="filled"
        >
          <AlertTitle>{alert.title}</AlertTitle>
          <li>{alert.message}</li>
        </Alert>
      ))}
    </Stack>
  );
};

export default AlertList;

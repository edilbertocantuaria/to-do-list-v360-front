import { useEffect } from "react";
import { Alert, AlertTitle, Box } from "@mui/material";

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
    <Box
      sx={{
        width: "98.95%",
        position: "fixed",
        bottom: 8,
        left: 8,
        zIndex: 9999
      }}
      spacing={2}
    >
      {alerts.map((alert, index) => (
        <Alert
          key={index}
          severity={alert.severity}
          onClose={() => onClose(index)}
          variant="filled"
          sx={{
            borderRadius: "16px",
            marginBottom: "16px",
            zIndex: 9999,
            position: "relative"
          }}
        >
          <AlertTitle>{alert.title}</AlertTitle>
          {Array.isArray(alert.message) ? (
            <>
              {alert.message.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </>
          ) : (
            <li>{alert.message}</li>
          )}
        </Alert>
      ))}
    </Box>
  );
};

export default AlertList;

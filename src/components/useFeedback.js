import { Alert, AlertTitle } from "@mui/material";
import { useSnackbar } from "notistack";

export default function useFeedback() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  function content(key, message = "", severity) {
    const body =
      typeof message === "string" || message.type ? message : message.body;
    const title = message.title;
    const bodyList = message.bodyList;

    return (
      <Alert
        variant="filled"
        elevation={6}
        onClose={() => closeSnackbar(key)}
        severity={severity}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {body}
        {bodyList && bodyList.length && (
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {bodyList.map((item, index) => (
              <li
                key={index}
                style={{ marginBottom: index !== bodyList.length - 1 ? 8 : 0 }}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </Alert>
    );
  }

  const anchorOrigin = { horizontal: "center", vertical: "bottom" };

  function showSuccess(message, options = {}) {
    enqueueSnackbar(message, {
      ...options,
      preventDuplicate: true,
      anchorOrigin,
      content: (key) => content(key, message, "success")
    });
  }

  function showInfo(message, options = {}) {
    enqueueSnackbar(message, {
      ...options,
      preventDuplicate: true,
      anchorOrigin,
      content: (key) => content(key, message, "info")
    });
  }

  function showWarning(message, options = {}) {
    enqueueSnackbar(message, {
      ...options,
      preventDuplicate: true,
      anchorOrigin,
      content: (key) => content(key, message, "warning")
    });
  }

  function showError(message, options = { persist: true }) {
    console.log(message);
    const newMessage = formatIfApiError(message);
    enqueueSnackbar(newMessage, {
      ...options,
      anchorOrigin,
      onClose: (event, reason, key) => {
        if (reason === "clickaway" && options.persist) {
          closeSnackbar(key);
        }
      },
      content: (key) => content(key, newMessage, "error")
    });
  }

  function formatIfApiError(message) {
    if (message instanceof ArrayBuffer) {
      // eslint-disable-next-line no-undef
      message = JSON.parse(Buffer.from(message).toString("utf8"));
    }

    let newMessage = message;
    if (message.message || message.errors) {
      if (message.errors && message.errors.length) {
        newMessage = {};
        newMessage.title = message.message;
        newMessage.bodyList = message.errors.map(
          (e) => e.message || e.defaultMessage
        );
      } else {
        newMessage = message.message;
      }
    }

    return newMessage;
  }

  return { showSuccess, showError, showInfo, showWarning };
}

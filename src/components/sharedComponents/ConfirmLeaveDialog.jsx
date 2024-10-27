import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";

export default function ConfirmLeaveDialog({
  open,
  onClose,
  onClickConfirm,
  onClickCancel
}) {
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="confirm-cancel-dialog"
      >
        <DialogTitle id="confirm-cancel-dialog">Confirm Cancel</DialogTitle>
        <DialogContent>
          All information will be lost. Do you want to proceed?
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickConfirm} sx={{ color: "#DA4646" }}>
            Back
          </Button>
          <Button onClick={onClickCancel} sx={{ color: "#0A69DD" }}>
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

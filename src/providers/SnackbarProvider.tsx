import React, {
  createContext,
  useContext,
  useState,
  ReactElement,
} from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface SnackbarContextProps {
  openSnackbar: (
    message: string,
    severity: "success" | "info" | "warning" | "error"
  ) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | null>(null);

export const SnackbarProvider = ({ children }: { children: ReactElement }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const openSnackbar = (
    message: string,
    severity: "success" | "info" | "warning" | "error"
  ) => {
    setOpen(true);
    setMessage(message);
    setSeverity(severity);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

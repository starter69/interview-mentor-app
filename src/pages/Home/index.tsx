import React, { useState } from "react";
import * as api from "api";
import {
  Box,
  Button,
  FormControl,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useProfile } from "providers/ProfileProvider";
import { useSnackbar } from "providers/SnackbarProvider";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Home = () => {
  const { profile, setProfile } = useProfile();
  const [dialogOpenStatus, setDialogOpenStatus] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const { openSnackbar } = useSnackbar();

  const handleOpenDialog = async () => {
    setDialogOpenStatus(true);
  };

  const handleCloseDialog = () => {
    setDialogOpenStatus(false);
  };

  const handleUpload = async () => {
    if (!companyName || !selectedFile) {
      return;
    }

    const formData = new FormData();
    if (selectedFile != null) formData.append("file", selectedFile);
    formData.append("user_id", profile.id.toString());
    formData.append("name", companyName);
    formData.append("duration", "90");
    try {
      await api.uploadInterview(formData);
      openSnackbar("Your interview video uploaded successfully.", "success");
    } catch (error) {
      openSnackbar("Failed to upload video.", "error");
    }
    setDialogOpenStatus(false);
  };

  return (
    <Box sx={{ marginTop: 3 }}>
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Upload
      </Button>
      <Modal open={dialogOpenStatus} onClose={handleCloseDialog}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Upload Interview Video
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <TextField
              type="file"
              id="outlined-size-small"
              size="small"
              onChange={handleFileChange}
              error={!selectedFile}
              helperText={!selectedFile && "File is required"}
            />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <TextField
              label="Company Name"
              id="outlined-size-small"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              size="small"
              error={!companyName}
              helperText={!companyName && "Company Name is required"}
            />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Button variant="contained" onClick={handleUpload}>
              Upload
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseDialog}
            >
              Cancel
            </Button>
          </FormControl>
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;

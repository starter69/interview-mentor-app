import React, { useState } from "react";
import * as api from "api";
import { Box, Button } from "@mui/material";
import { useProfile } from "providers/ProfileProvider";
import { useSnackbar } from "providers/SnackbarProvider";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { profile, setProfile } = useProfile();

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const { openSnackbar } = useSnackbar();

  const handleUpload = async () => {
    const formData = new FormData();
    if (selectedFile != null) formData.append("file", selectedFile);
    formData.append("user_id", profile.id.toString());
    formData.append("name", "sedgwick");
    formData.append("duration", "90");
    try {
      await api.uploadInterview(formData);
      openSnackbar("Your interview video uploaded successfully.", "success");
    } catch (error) {
      openSnackbar("Failed to upload video.", "error");
    }
  };

  return (
    <Box sx={{ marginTop: 3 }}>
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button>
    </Box>
  );
};

export default Home;

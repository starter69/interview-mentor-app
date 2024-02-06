import React, { useState, useEffect } from "react";

import playBtn from "assets/play-btn.png";
import * as api from "api";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useProfile } from "providers/ProfileProvider";
import { useSnackbar } from "providers/SnackbarProvider";
import { InterviewDetailType } from "api/types";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";

import "../../index.css";

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
  const { profile } = useProfile();
  const [dialogOpenStatus, setDialogOpenStatus] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [interviews, setInterviews] = useState<InterviewDetailType[]>([]);
  const navigator = useNavigate();

  const fetchInterviews = async () => {
    try {
      const response = await api.getInterviews();
      setInterviews(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const { openSnackbar } = useSnackbar();

  const handleOpenDialog = async () => {
    setDialogOpenStatus(true);
  };

  const handleCloseDialog = () => {
    setDialogOpenStatus(false);
    setSelectedFile(null);
    setCompanyName("");
    setIsSubmitted(false);
  };

  const handleUpload = async () => {
    setIsSubmitted(true);

    if (!companyName || !selectedFile) {
      return;
    }

    const allowedFileTypes = ["video/mp4"];
    if (!allowedFileTypes.includes(selectedFile.type)) {
      openSnackbar("Only MP4 files are allowed for now.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", profile.id.toString());
    formData.append("name", companyName);
    formData.append("duration", "90");
    if (selectedFile != null) formData.append("file", selectedFile);

    setIsLoading(true);
    try {
      await api.uploadInterview(formData);
      openSnackbar("Your interview video uploaded successfully.", "success");
      fetchInterviews();
    } catch (error: any) {
      openSnackbar(error.response.data.message, "error");
    }
    setIsLoading(false);
    handleCloseDialog();
  };

  return (
    <Box>
      <Button
        sx={{ marginTop: "16px" }}
        variant='contained'
        color='primary'
        onClick={handleOpenDialog}
      >
        Upload
      </Button>
      <Grid container spacing={2} sx={{ padding: "12px" }}>
        {interviews.map((interview, index) => {
          return (
            <Grid item xs={2} key={index}>
              <Box
                className='interview-component'
                onClick={() => {
                  navigator(`/interviews/${interview.id}/detail`);
                }}
              >
                <Typography style={{ color: "white" }}>
                  {interview.user.name} : {interview.name}
                </Typography>
                <Box
                  component='img'
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                  alt='playbtn'
                  src={playBtn}
                />
              </Box>
            </Grid>
          );
        })}
        {interviews.length === 0 && (
          <Grid item xs={12}>
            <Typography variant='h6'>No Interviews yet</Typography>
          </Grid>
        )}
      </Grid>
      <Modal open={dialogOpenStatus} onClose={handleCloseDialog}>
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Upload Interview Video
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
            <TextField
              type='file'
              id='outlined-size-small'
              size='small'
              onChange={handleFileChange}
              error={isSubmitted === true && !selectedFile}
              helperText={
                isSubmitted === true && !selectedFile && "File is required"
              }
            />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
            <TextField
              label='Company Name'
              id='outlined-size-small'
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              size="small"
              error={isSubmitted === true && !companyName}
              helperText={
                isSubmitted === true &&
                !companyName &&
                "Company Name is required"
              }
            />
          </FormControl>
          <Box sx={{ textAlign: "center" }}>
            <Button
              sx={{ marginRight: 3 }}
              variant='contained'
              onClick={handleUpload}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color='inherit' />
              ) : (
                "Upload"
              )}
            </Button>
            <Button
              variant='contained'
              color='error'
              onClick={handleCloseDialog}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;

import { Box, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import * as api from "api";
import { InterviewDetailType } from "api/types";
import { useSnackbar } from "providers/SnackbarProvider";
import { convertSecondsToHMS } from "utils/convertSecondToHMS";
import { convertDateFormat } from "utils/convertDateFormat";

const InterviewDetail: React.FC = () => {
  const { id } = useParams();
  const [interviewDetail, setInterviewDetail] = useState<InterviewDetailType>();
  const [username, setUsername] = useState();
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchInterviewDetail = async () => {
      try {
        const response = await api.getInterviewDetail(Number(id));
        setInterviewDetail(response.data);

        const user = await api.getUser(response.data.user_id);
        setUsername(user.data?.name);

        setDuration(convertSecondsToHMS(response.data.duration));

        setDate(convertDateFormat(response.data.date));
      } catch (error: any) {
        openSnackbar(
          error?.response?.data.error ?? "Failed to fetch interview detail.",
          "error"
        );
      }
    };

    fetchInterviewDetail();
  }, [id, openSnackbar]);

  return (
    <Container>
      <Box sx={{ marginY: 3, display: "flex", justifyContent: "center" }}>
        <ReactPlayer
          url={`http://${api.host}:${api.port}/` + interviewDetail?.path}
          width="1366"
          height="768"
          controls
        />
      </Box>
      <Typography variant="h5">
        Company Name: {interviewDetail?.name}
      </Typography>
      <Typography variant="h6">Interviewee: {username}</Typography>
      <Typography variant="h6">Interview Duration: {duration}</Typography>
      <Typography variant="h6">Interview Date: {date}</Typography>
    </Container>
  );
};

export default InterviewDetail;

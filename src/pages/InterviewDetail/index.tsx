import { Box, Container, Typography } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PunchClockIcon from "@mui/icons-material/PunchClock";
import EventNoteIcon from "@mui/icons-material/EventNote";
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
    <Container maxWidth="md">
      <Box sx={{ marginY: 3, display: "flex" }}>
        <ReactPlayer
          url={`http://${api.host}:${api.port}/` + interviewDetail?.path}
          width="100%"
          height="auto"
          controls
        />
      </Box>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: "50%" }}>
          <Typography
            variant="body1"
            sx={{ display: "flex", alignSelf: "center" }}
          >
            <SupportAgentIcon sx={{ marginRight: 2 }} />
            {username}
          </Typography>
          <Typography
            variant="body1"
            sx={{ display: "flex", alignSelf: "center" }}
          >
            <BusinessIcon sx={{ marginRight: 2 }} />
            {interviewDetail?.name}
          </Typography>
        </Box>
        <Box sx={{ width: "50%" }}>
          <Typography
            variant="body1"
            sx={{ display: "flex", alignSelf: "center" }}
          >
            <EventNoteIcon sx={{ marginRight: 2 }} />
            {date}
          </Typography>
          <Typography
            variant="body1"
            sx={{ display: "flex", alignSelf: "center" }}
          >
            <PunchClockIcon sx={{ marginRight: 2 }} />
            {duration}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default InterviewDetail;

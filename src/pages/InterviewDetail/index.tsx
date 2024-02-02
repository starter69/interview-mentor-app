import { Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
    fetchInterviewDetail();
  }, []);

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
  return (
    <Container>
      {interviewDetail && (
        <video controls>
          <source
            src={`http://localhost:3200/` + interviewDetail?.path}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      )}
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

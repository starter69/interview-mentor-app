import React, { useState, useEffect } from "react";

import { Grid, Typography, Box } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import * as api from "api";
import { InterviewDetailType } from "api/types";
import { useNavigate } from "react-router";
import InterviewCard from "pages/InterviewCard";

const MyInterview: React.FC = () => {
  const [myInterviews, setMyInterviews] = useState<InterviewDetailType[]>([]);
  const navigator = useNavigate();

  const fetchMyInterviews = async () => {
    try {
      const { data } = await api.GetCurrentUser();
      if (!data) return;
      const response = await api.getMyInterviews(data.id);
      setMyInterviews(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyInterviews();
  }, []);

  return (
    <Box>
      <Grid
        container
        spacing={2}
        sx={{ padding: "12px" }}
        columns={{ xs: 4, sm: 8, md: 8 }}
      >
        {myInterviews.length > 0 &&
          myInterviews.map((interview) => {
            return <InterviewCard interview={interview} />;
          })}
        {myInterviews.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="h6">No Interviews yet</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default MyInterview;

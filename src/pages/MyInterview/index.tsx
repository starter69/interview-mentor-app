import React, {useState, useEffect } from "react";

import { Grid, Typography, Box} from "@mui/material";
import * as api from 'api'
import { InterviewDetailType } from "api/types";
import playBtn from 'assets/play-btn.png'
import { useNavigate } from "react-router";

const MyInterview: React.FC = () => {
  const [myInterviews, setMyInterviews] = useState<InterviewDetailType[]>([]);
  const navigator = useNavigate()

  const fetchMyInterviews = async () => {
    try {
      const { data } = await api.GetCurrentUser();
      if(!data) return;
      const response = await api.getMyInterviews(data.id);
      setMyInterviews(response.data)
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchMyInterviews();
  }, []);

  return (
    <Box>
      <Typography sx={{ marginTop: "16px", marginBottom: "10px", fontStyle: 'italic'}} variant="h4" gutterBottom>
        Welcome to the My Interview Page
      </Typography>
      <Grid container spacing={2} sx={{ padding: "12px" }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {myInterviews.length > 0 && myInterviews.map((interview) => {
          return (
            <Grid item xs={2} key={interview.id}>
              <Box className="interview-component" onClick={() => {
                navigator(`/interviews/${interview.id}/detail`);
              }}>
                <Typography style={{ color: "white" }}>
                   {interview.user.name} - {interview.name}
                </Typography>
                <Box
                  component="img"
                  sx={{
                    height: 50,
                    width: 50,
                  }}
                  alt="playbtn"
                  src={playBtn}
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default MyInterview;

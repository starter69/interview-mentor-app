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
      <Grid container spacing={2} sx={{ padding: "12px" }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {myInterviews.length > 0 && myInterviews.map((interview, index) => {
          return (
            <Grid item xs={2} key={index}>
              <Box className="interview-component" onClick={() => {
                navigator(`/interviews/${interview.id}/detail`);
              }}>
                <Typography style={{ color: "white" }}>
                {interview.user.name} : {interview.name}
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
        {myInterviews.length === 0 && <Grid item xs={12}><Typography variant="h6">No Interviews yet</Typography></Grid>}
      </Grid>
    </Box>
  );
};

export default MyInterview;

import { Box, Grid } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useNavigate } from "react-router-dom";
import * as api from "api";
import { InterviewDetailType } from "api/types";
import "pages/InterviewCard.css";

const InterviewCard: React.FC<{ interview: InterviewDetailType }> = ({
  interview,
}) => {
  const navigator = useNavigate();

  return (
    <Grid item xs={2} key={interview.id}>
      <Box
        onClick={() => {
          navigator(`/interviews/${interview.id}/detail`);
        }}
      >
        <Box sx={{ position: "relative" }} className="interview-thumbnail">
          <img
            src={`http://${api.host}:${api.port}/${interview?.thumbnail_path}`}
            alt="thumbnail"
          />
          <img src={`/play-btn.png`} className="play-button" />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Box
          sx={{
            alignContent: "center",
            display: "flex",
          }}
        >
          <SupportAgentIcon sx={{ marginRight: 1 }} />
          {interview.user.name}
        </Box>
        <Box
          sx={{
            alignContent: "center",
            display: "flex",
          }}
        >
          <BusinessIcon sx={{ marginRight: 1 }} />
          {interview.name}
        </Box>
      </Box>
    </Grid>
  );
};

export default InterviewCard;

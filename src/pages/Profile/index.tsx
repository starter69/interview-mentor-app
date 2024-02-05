import React from "react";

import { Box, Typography } from "@mui/material";

const Profile: React.FC = () => {
  return (
    <Box  sx={{ fontStyle: 'italic' }}>
      <Typography sx={{ marginTop: "16px", marginBottom: "10px"}} variant="h4" gutterBottom>
        Welcome to the Profile Page
      </Typography>
    </Box>
  );
};

export default Profile;

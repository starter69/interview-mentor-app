import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import * as api from "api";
import { useSnackbar } from "providers/SnackbarProvider";
import { useProfile } from "providers/ProfileProvider";

const defaultTheme = createTheme();

const Profile = () => {
  const { profile } = useProfile();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { openSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (newPassword !== passwordConfirm) {
      openSnackbar("New password and confirm password do not match.", "error");
      return;
    }

    try {
      await api.updatePassword({
        user_id: profile.id,
        old_password: oldPassword,
        new_password: newPassword,
      });
      openSnackbar("Password updated successfully.", "success");
      setOldPassword("");
      setNewPassword("");
      setPasswordConfirm("");
    } catch (error: any) {
      openSnackbar(
        error?.response?.data.message ?? "Failed to update password.",
        "error"
      );
    }
    setIsSubmitted(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === "Enter" &&
      oldPassword &&
      newPassword &&
      passwordConfirm
    ) {
      handleSubmit();
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Update Password
          </Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="oldPassword"
              label="Old Password"
              name="oldPassword"
              type="password"
              autoComplete="oldPassword"
              autoFocus
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              error={isSubmitted && oldPassword.length === 0}
              helperText={
                isSubmitted && oldPassword.length === 0
                  ? "Old Password is required."
                  : ""
              }
              onKeyDown={handleKeyPress}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              autoComplete="newPassword"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              error={isSubmitted && newPassword.length === 0}
              helperText={
                isSubmitted && newPassword.length === 0
                  ? "New Password is required."
                  : ""
              }
              onKeyDown={handleKeyPress}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="passwordConfirm"
              label="Confirm Password"
              type="password"
              id="passwordConfirm"
              autoComplete="passwordConfirm"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              error={isSubmitted && passwordConfirm.length === 0}
              helperText={
                isSubmitted && passwordConfirm.length === 0
                  ? "Confirm Password is required."
                  : ""
              }
              onKeyDown={handleKeyPress}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              sx={{ mt: 3, mb: 2 }}
              disabled={
                !oldPassword ||
                !newPassword ||
                !passwordConfirm ||
                newPassword !== passwordConfirm
              }
            >
              Update
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Profile;

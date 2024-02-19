import React, { useEffect, useState } from "react";

import * as api from "api";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  Modal,
  FormControl,
  MenuItem,
  InputLabel,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useSnackbar } from "providers/SnackbarProvider";
import { TeamInfo } from "api/types";
import { InterviewDetailType } from "api/types";
import { convertDateFormat } from "utils/convertDateFormat";
import { convertSecondsToHMS } from "utils/convertSecondToHMS";

import "../../index.css";

const teamStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

// const teamColumns: GridColDef[] = [
//   { field: "index", headerName: "#", flex: 1 },
//   { field: "name", headerName: "Team", flex: 1 },
// ];

const userStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "45%", // Set a relative width using percentage
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  "@media (max-width: 600px)": {
    width: "90%",
  },
};

const userColumns: GridColDef[] = [
  { field: "index", headerName: "#", flex: 1 },
  { field: "name", headerName: "User", flex: 1 },
  { field: "team_name", headerName: "Team", flex: 1 },
  {
    field: "role",
    headerName: "Role",
    flex: 1,
    renderCell: (params) => {
      const { value } = params;
      let className = "";

      if (value === "ADMIN") {
        className = "admin-label";
      } else if (value === "LEAD") {
        className = "lead-label";
      } else if (value === "USER") {
        className = "user-label";
      }

      return <div className={className}>{value}</div>;
    },
  },
];

const interviewColumns: GridColDef[] = [
  {
    field: "index",
    headerName: "#",
    flex: 1,
  },
  { field: "name", headerName: "Company", flex: 1 },
  {
    field: "user_name",
    headerName: "User",
    flex: 1,
    renderCell: (params) => {
      return <span>{params.row.user.name}</span>;
    },
  },
  {
    field: "duration",
    headerName: "Duration",
    flex: 1,
    renderCell: (params) => {
      return <span>{convertSecondsToHMS(params.value)}</span>;
    },
  },
  {
    field: "date",
    headerName: "Created At",
    flex: 1,
    renderCell: (params) => {
      return <span>{convertDateFormat(params.value)}</span>;
    },
  },
];

type User = {
  id: number;
  name: string;
  team_name: string;
  role: string;
};

const Management: React.FC = () => {
  // const [addTeamModalOpen, setAddTeamModalOpen] = useState(false);
  // const [updateTeamModalOpen, setUpdateTeamModalOpen] = useState(false);
  // const [deleteTeamModalOpen, setDeleteTeamModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [updateUserModalOpen, setUpdateUserModalOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [resetUserModalOpen, setResetUserModalOpen] = useState(false);
  const [updateInterviewModalOpen, setUpdateInterviewModalOpen] =
    useState(false);
  const [deleteInterviewModalOpen, setDeleteInterviewModalOpen] =
    useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [interviews, setInterviews] = useState<InterviewDetailType[]>([]);
  const [companyName, setCompanyName] = useState("");
  // const [originTeams, setOriginTeams] = useState<TeamInfo[]>([]);
  const [role, setRole] = useState("USER");
  // const [setTeamName] = useState("");
  const [team, setTeam] = useState("No Team");
  const [userName, setUserName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  // const [teamRowSelectionModel, setTeamRowSelectionModel] =
  //   useState<GridRowSelectionModel>();
  const [userRowSelectionModel, setUserRowSelectionModel] =
    useState<GridRowSelectionModel>();
  const [interviewRowSelectionModel, setInterviewRowSelectionModel] =
    useState<GridRowSelectionModel>();
  const roles = [
    { title: "ADMIN", style: "admin-label" },
    { title: "LEAD", style: "lead-label" },
    { title: "USER", style: "user-label" },
  ];
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [response1, response2, response3] = await Promise.all([
        api.getUsers(),
        api.getTeams(),
        api.getInterviews(),
      ]);
      const formattedUsers = await response1.data.map(
        (user: {
          id: number;
          name: string;
          role: string;
          team_id: number;
          team: {
            name: string;
          };
        }) => ({
          id: user.id,
          name: user.name,
          role: user.role,
          team_name: user.team ? user.team.name : "No Team",
        })
      );
      setUsers(formattedUsers);
      setTeams([{ id: -1, name: "No Team" }, ...response2.data]);
      setInterviews(response3.data);
      // setOriginTeams(response2.data);
    } catch (error: any) {
      openSnackbar(
        error?.response?.data.error ??
          "Failed to fetch users and teams, interviews.",
        "error"
      );
    }
  };

  const handleRole = (event: SelectChangeEvent) => {
    setRole(event.target.value);
  };

  const handleTeam = (event: SelectChangeEvent) => {
    setTeam(event.target.value);
  };

  // // Teams
  // const handleTeamAddModalOpen = () => {
  //   setAddTeamModalOpen(true);
  // };

  // const handleTeamAddClose = () => {
  //   setAddTeamModalOpen(false);
  //   init();
  // };

  // const handleTeamUpdateOpen = () => {
  //   if (!teamRowSelectionModel?.length) {
  //     openSnackbar("Please select a team first.", "error");
  //     return;
  //   }
  //   const index = Number(teamRowSelectionModel[0]);
  //   const selectedTeam = teams.find((team) => team.id === index);
  //   if (!selectedTeam) {
  //     return;
  //   }
  //   setTeamName(selectedTeam.name);
  //   // setUpdateTeamModalOpen(true);
  // };

  // const handleTeamUpdateClose = () => {
  //   // setUpdateTeamModalOpen(false);
  //   setTeamRowSelectionModel([]);
  //   init();
  // };

  // const handleTeamDeleteOpen = () => {
  //   if (!teamRowSelectionModel?.length) {
  //     openSnackbar("Please select a team first.", "error");
  //     return;
  //   }
  //   setDeleteTeamModalOpen(true);
  // };

  // const handleTeamDeleteClose = () => {
  //   setDeleteTeamModalOpen(false);
  //   setTeamRowSelectionModel([]);
  // };

  // const handleTeamAdd = async () => {
  //   setIsSubmitted(true);
  //   if (!teamName) return;
  //   try {
  //     await api.addTeam({ name: teamName });
  //     fetchData();
  //     openSnackbar("New team added successfully.", "success");
  //   } catch (error: any) {
  //     openSnackbar(
  //       error?.response?.data.error ?? "Failed to add new team.",
  //       "error"
  //     );
  //   }
  //   // handleTeamAddClose();
  // };

  // const handleTeamUpdate = async () => {
  //   setIsSubmitted(true);
  //   if (!teamName) return;
  //   try {
  //     if (!teamRowSelectionModel?.length) {
  //       setConfirmModalOpen(true);
  //       return;
  //     }
  //     await api.updateTeam(Number(teamRowSelectionModel[0]), {
  //       name: teamName,
  //     });
  //     fetchData();
  //     openSnackbar("Team updated successfully.", "success");
  //   } catch (error: any) {
  //     openSnackbar(
  //       error?.response?.data.error ?? "Failed to update team.",
  //       "error"
  //     );
  //   }
  //   handleTeamUpdateClose();
  // };

  // const handleTeamDelete = async () => {
  //   try {
  //     if (!teamRowSelectionModel?.length) {
  //       setConfirmModalOpen(true);
  //       return;
  //     }
  //     await api.deleteTeam(Number(teamRowSelectionModel[0]));
  //     fetchData();
  //     handleTeamDeleteClose();
  //     openSnackbar("Team deleted successfully.", "success");
  //   } catch (error: any) {
  //     openSnackbar(
  //       error?.response?.data.error ?? "Failed to delete team.",
  //       "error"
  //     );
  //   }
  // };

  // Users

  const handleAddModalOpen = () => {
    setAddUserModalOpen(true);
  };

  const handleAddClose = () => {
    setAddUserModalOpen(false);
    init();
  };

  const handleUpdateOpen = () => {
    if (!userRowSelectionModel?.length) {
      openSnackbar("Please select a user first.", "error");
      return;
    }
    const index = Number(userRowSelectionModel[0]);
    const selectedUser = users.find((user) => user.id === index);
    if (!selectedUser) {
      return;
    }
    setUserName(selectedUser.name);
    setRole(selectedUser.role);
    setTeam(selectedUser.team_name);
    setUpdateUserModalOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateUserModalOpen(false);
    setUserRowSelectionModel([]);
    init();
  };

  const handleDeleteOpen = () => {
    if (!userRowSelectionModel?.length) {
      openSnackbar("Please select a user first.", "error");
      return;
    }
    setDeleteUserModalOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteUserModalOpen(false);
    setUserRowSelectionModel([]);
  };

  const handleResetOpen = () => {
    if (!userRowSelectionModel?.length) {
      openSnackbar("Please selct a user first.", "error");
      return;
    }
    setResetUserModalOpen(true);
  };

  const handleResetClose = () => {
    setResetUserModalOpen(false);
    setUserRowSelectionModel([]);
  };

  const handleConfirmClose = () => {
    setConfirmModalOpen(false);
    setInterviewRowSelectionModel([]);
  };

  const handleAdd = async () => {
    setIsSubmitted(true);
    if (!userName || !role || !team) return;
    try {
      const selectedTeam = teams.find((item) => item.name === team);
      if (!selectedTeam) {
        await api.addUser({
          name: userName,
          role,
          team_id: -1,
          password: "12345678",
        });
      } else {
        await api.addUser({
          name: userName,
          role,
          team_id: selectedTeam.id,
          password: "12345678",
        });
      }
      fetchData();
      openSnackbar("New user added successfully.", "success");
    } catch (error: any) {
      openSnackbar(
        error?.response?.data.error ?? "Failed to add new user.",
        "error"
      );
    }
    handleAddClose();
  };

  const handleUpdate = async () => {
    setIsSubmitted(true);
    if (!userName || !role || !team) return;
    try {
      const selectedTeam = teams.find((item) => item.name === team);
      if (!userRowSelectionModel?.length || !selectedTeam) {
        return;
      }
      await api.updateUser(
        Number(userRowSelectionModel[userRowSelectionModel.length - 1]),
        { name: userName, role, team_id: selectedTeam.id }
      );
      fetchData();
      openSnackbar("User updated successfully.", "success");
    } catch (error: any) {
      openSnackbar(
        error?.response?.data.error ?? "Failed to update user.",
        "error"
      );
    }
    handleUpdateClose();
  };

  const handleDelete = async () => {
    try {
      if (!userRowSelectionModel?.length) return;
      await api.deleteUser(
        Number(userRowSelectionModel[userRowSelectionModel.length - 1])
      );
      fetchData();
      handleDeleteClose();
      openSnackbar("User deleted successfully.", "success");
    } catch (error: any) {
      openSnackbar(
        error?.response?.data.error ?? "Failed to delete user.",
        "error"
      );
    }
  };

  const handleReset = async () => {
    try {
      const selectedTeam = teams.find((item) => item.name === team);
      if (!userRowSelectionModel?.length || !selectedTeam) {
        return;
      }
      await api.resetPassword(Number(userRowSelectionModel[0]));
      fetchData();
      handleResetClose();
      openSnackbar("User reset successfully.", "success");
    } catch (error: any) {
      openSnackbar(
        error?.response?.data.error ?? "Failed to reset password.",
        "error"
      );
    }
  };

  // Interviews
  const handleInterviewUpdateOpen = () => {
    if (!interviewRowSelectionModel?.length) {
      openSnackbar("Please select an interview first.", "error");
      return;
    }
    const index = Number(interviewRowSelectionModel[0]);
    const selectedInterview = interviews.find(
      (interview) => interview.id === index
    );
    if (!selectedInterview) {
      return;
    }
    setCompanyName(selectedInterview.name);
    setUpdateInterviewModalOpen(true);
  };

  const handleInterviewUpdateClose = () => {
    setUpdateInterviewModalOpen(false);
    setInterviewRowSelectionModel([]);
    init();
  };

  const handleInterviewDeleteOpen = () => {
    if (!interviewRowSelectionModel?.length) {
      openSnackbar("Please select an interview first.", "error");
      return;
    }
    setDeleteInterviewModalOpen(true);
  };

  const handleInterviewDeleteClose = () => {
    setDeleteInterviewModalOpen(false);
    setInterviewRowSelectionModel([]);
  };

  const handleInterviewUpdate = async () => {
    setIsSubmitted(true);
    if (!companyName || !interviewRowSelectionModel?.length) return;
    try {
      const selectedInterview = interviews.find(
        (item) => item.id === Number(interviewRowSelectionModel[0])
      );
      if (!interviewRowSelectionModel?.length || !selectedInterview) {
        return;
      }
      await api.updateInterview(Number(interviewRowSelectionModel[0]), {
        company_name: companyName,
      });
      fetchData();
      openSnackbar("Interview updated successfully.", "success");
    } catch (error: any) {
      openSnackbar(
        error?.response?.data.error ?? "Failed to update interview.",
        "error"
      );
    }
    handleInterviewUpdateClose();
  };

  const handleInterviewDelete = async () => {
    try {
      if (!interviewRowSelectionModel?.length) return;
      await api.deleteInterview(
        Number(
          interviewRowSelectionModel[interviewRowSelectionModel.length - 1]
        )
      );
      fetchData();
      handleInterviewDeleteClose();
      openSnackbar("Interview deleted successfully.", "success");
    } catch (error: any) {
      openSnackbar(
        error?.response?.data.error ?? "Failed to delete interview.",
        "error"
      );
    }
  };

  function init() {
    setUserName("");
    setRole("USER");
    setTeam("No Team");
    // setTeamName("");
    setCompanyName("");
    setIsSubmitted(false);
  }

  return (
    <Box>
      <Grid container spacing={2} sx={{ marginTop: 6, padding: "12px" }}>
        {/* <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ width: "100%", textAlign: "right", marginBottom: "12px" }}>
            <Button variant="contained" onClick={handleTeamAddModalOpen}>
              + Add
            </Button>
            <Button
              style={{ marginLeft: "8px" }}
              variant="contained"
              color="error"
              onClick={handleTeamDeleteOpen}
            >
              Delete
            </Button>
            <Button
              style={{ marginLeft: "8px" }}
              variant="contained"
              color="secondary"
              onClick={handleTeamUpdateOpen}
            >
              Update
            </Button>
          </Box>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={originTeams.map((item, index) => ({
                index: index + 1,
                ...item,
              }))}
              columns={teamColumns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 50 },
                },
              }}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setTeamRowSelectionModel(newRowSelectionModel);
              }}
              rowSelectionModel={teamRowSelectionModel}
              pageSizeOptions={[50, 10]}
            />
          </Box>
        </Grid> */}
        <Grid item xs={12} sm={12} md={6}>
          <Box sx={{ width: "100%", textAlign: "right", marginBottom: "12px" }}>
            <Button variant="contained" onClick={handleAddModalOpen}>
              + Add
            </Button>
            <Button
              style={{ marginLeft: "8px" }}
              variant="contained"
              color="error"
              onClick={handleDeleteOpen}
            >
              Delete
            </Button>
            <Button
              style={{ marginLeft: "8px" }}
              variant="contained"
              color="secondary"
              onClick={handleUpdateOpen}
            >
              Update
            </Button>
            <Button
              style={{ marginLeft: "8px" }}
              variant="contained"
              color="inherit"
              onClick={handleResetOpen}
            >
              Reset
            </Button>
          </Box>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={users.map((item, index) => ({ index: index + 1, ...item }))}
              columns={userColumns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 50 },
                },
              }}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setUserRowSelectionModel(newRowSelectionModel);
              }}
              rowSelectionModel={userRowSelectionModel}
              pageSizeOptions={[50, 10]}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Box sx={{ width: "100%", textAlign: "right", marginBottom: "12px" }}>
            <Button
              style={{ marginLeft: "8px" }}
              variant="contained"
              color="error"
              onClick={handleInterviewDeleteOpen}
            >
              Delete
            </Button>
            <Button
              style={{ marginLeft: "8px" }}
              variant="contained"
              color="secondary"
              onClick={handleInterviewUpdateOpen}
            >
              Update
            </Button>
          </Box>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={interviews.map((item, index) => ({
                index: index + 1,
                ...item,
              }))}
              columns={interviewColumns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 50 },
                },
              }}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setInterviewRowSelectionModel(newRowSelectionModel);
              }}
              rowSelectionModel={interviewRowSelectionModel}
              pageSizeOptions={[50, 10]}
            />
          </Box>
        </Grid>
      </Grid>
      {/* <Modal open={addTeamModalOpen} onClose={handleTeamAddClose}>
        <Box sx={teamStyle}>
          <Typography variant="h6" component="h2">
            Add New Team
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <TextField
              required
              label="Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              size="small"
              error={teamName.length === 0 && isSubmitted}
              helperText={
                isSubmitted && teamName.length === 0
                  ? "Team name is required."
                  : ""
              }
            />
          </FormControl>
          <FormControl
            sx={{ m: 1, minWidth: 120, marginTop: "12px" }}
            size="small"
          >
            <Button variant="contained" onClick={handleTeamAdd}>
              Add
            </Button>
          </FormControl>
        </Box>
      </Modal>
      <Modal open={updateTeamModalOpen} onClose={handleTeamUpdateClose}>
        <Box sx={teamStyle}>
          <Typography variant="h6" component="h2">
            Update Existing Team
          </Typography>
          <FormControl
            sx={{ m: 1, minWidth: 120, marginTop: "12px" }}
            size="small"
          >
            <TextField
              required
              label="Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              size="small"
              error={teamName.length === 0 && isSubmitted}
              helperText={
                isSubmitted && teamName.length === 0
                  ? "Team name is required."
                  : ""
              }
            />
          </FormControl>
          <FormControl
            sx={{ m: 1, minWidth: 120, marginTop: "12px" }}
            size="small"
          >
            <Button variant="contained" onClick={handleTeamUpdate}>
              Update
            </Button>
          </FormControl>
        </Box>
      </Modal>
      <Modal open={deleteTeamModalOpen} onClose={handleTeamDeleteClose}>
        <Box sx={teamStyle}>
          <Typography variant="h6" component="h2">
            Are you sure want to delete this team?
          </Typography>
          <Box sx={{ textAlign: "right", marginTop: "12px" }}>
            <Button
              variant="contained"
              onClick={handleTeamDelete}
              color="error"
            >
              Yes
            </Button>
            <Button
              style={{ marginLeft: "12px" }}
              variant="contained"
              onClick={handleTeamDeleteClose}
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal> */}
      <Modal open={addUserModalOpen} onClose={handleAddClose}>
        <Box sx={userStyle}>
          <Typography variant="h6" component="h2">
            Add New User
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <TextField
              required
              label="Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              size="small"
              error={userName.length === 0 && isSubmitted}
              helperText={
                isSubmitted && userName.length === 0
                  ? "Username is required."
                  : ""
              }
            />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Role</InputLabel>
            <Select value={role} label="Role" onChange={handleRole}>
              {roles.map((role, index) => {
                return (
                  <MenuItem value={role.title} key={index}>
                    <Typography className={role.style} variant="caption">
                      {role.title}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Team</InputLabel>
            <Select value={team.toString()} label="Role" onChange={handleTeam}>
              {teams.length > 0 &&
                teams.map((t) => {
                  return (
                    <MenuItem value={t.name} key={t.id}>
                      {t.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Button variant="contained" onClick={handleAdd}>
              Add
            </Button>
          </FormControl>
        </Box>
      </Modal>
      <Modal open={updateUserModalOpen} onClose={handleUpdateClose}>
        <Box sx={userStyle}>
          <Typography variant="h6" component="h2">
            Update Existing User
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <TextField
              required
              label="Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              size="small"
              error={userName.length === 0}
              helperText={userName.length === 0 ? "Username is required." : ""}
            />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Role</InputLabel>
            <Select value={role} label="Role" onChange={handleRole}>
              {roles.map((role, index) => {
                return (
                  <MenuItem value={role.title} key={index}>
                    <Typography className={role.style} variant="caption">
                      {role.title}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Team</InputLabel>
            <Select value={team.toString()} label="Role" onChange={handleTeam}>
              {teams.length > 0 &&
                teams.map((t) => {
                  return (
                    <MenuItem value={t.name} key={t.id}>
                      {t.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Button variant="contained" onClick={handleUpdate}>
              Update
            </Button>
          </FormControl>
        </Box>
      </Modal>
      <Modal open={deleteUserModalOpen} onClose={handleDeleteClose}>
        <Box sx={userStyle}>
          <Typography variant="h6" component="h2">
            Are you sure want to delete this user?
          </Typography>
          <Box sx={{ textAlign: "right" }}>
            <Button variant="contained" onClick={handleDelete} color="error">
              Yes
            </Button>
            <Button
              style={{ marginLeft: "12px" }}
              variant="contained"
              onClick={handleDeleteClose}
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={resetUserModalOpen} onClose={handleResetClose}>
        <Box sx={userStyle}>
          <Typography variant="h6" component="h2">
            Are you sure want to reset password of this user?
          </Typography>
          <Box sx={{ textAlign: "right" }}>
            <Button variant="contained" onClick={handleReset} color="error">
              Yes
            </Button>
            <Button
              style={{ marginLeft: "12px" }}
              variant="contained"
              onClick={handleResetClose}
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={confirmModalOpen} onClose={handleConfirmClose}>
        <Box sx={userStyle}>
          <Typography variant="h6" component="h2">
            Please select a row first.
          </Typography>
          <Box sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              onClick={handleConfirmClose}
              color="error"
            >
              Okay
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={updateInterviewModalOpen}
        onClose={handleInterviewUpdateClose}
      >
        <Box sx={teamStyle}>
          <Typography variant="h6" component="h2">
            Update Existing Interview
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <TextField
              required
              label="Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              size="small"
              error={isSubmitted === true && companyName.length === 0}
              helperText={
                isSubmitted === true && companyName.length === 0
                  ? "Company name is required."
                  : ""
              }
            />
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Button variant="contained" onClick={handleInterviewUpdate}>
              Update
            </Button>
          </FormControl>
        </Box>
      </Modal>
      <Modal
        open={deleteInterviewModalOpen}
        onClose={handleInterviewDeleteClose}
      >
        <Box sx={teamStyle}>
          <Typography variant="h6" component="h2">
            Are you sure want to delete this interview?
          </Typography>
          <Box sx={{ textAlign: "right", marginTop: "16px" }}>
            <Button
              variant="contained"
              onClick={handleInterviewDelete}
              color="error"
            >
              Yes
            </Button>
            <Button
              style={{ marginLeft: "12px" }}
              variant="contained"
              onClick={handleInterviewDeleteClose}
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Management;

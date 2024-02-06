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

const teamColumns: GridColDef[] = [
  { field: "index", headerName: "ID", flex: 1 },
  { field: "name", headerName: "Team Name", flex: 1 },
];

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
  { field: "index", headerName: "ID", flex: 1 },
  { field: "name", headerName: "User Name", flex: 1 },
  { field: "team_name", headerName: "Team Name", flex: 1 },
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

type User = {
  id: number;
  name: string;
  team_name: string;
  role: string;
};

const Management: React.FC = () => {
  const [addTeamModalOpen, setAddTeamModalOpen] = useState(false);
  const [updateTeamModalOpen, setUpdateTeamModalOpen] = useState(false);
  const [deleteTeamModalOpen, setDeleteTeamModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [updateUserModalOpen, setUpdateUserModalOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [originTeams, setOriginTeams] = useState<TeamInfo[]>([]);
  const [role, setRole] = useState("USER");
  const [teamName, setTeamName] = useState("");
  const [team, setTeam] = useState("No Team");
  const [userName, setUserName] = useState("");
  const [isSubmitClicked, setIsSubmitClicked] = useState(false)
  const [teamRowSelectionModel, setTeamRowSelectionModel] =
    useState<GridRowSelectionModel>();
  const [userRowSelectionModel, setUserRowSelectionModel] =
    useState<GridRowSelectionModel>();
  const roles = [
    { title: "ADMIN", style: "admin-label" },
    { title: "LEAD", style: "lead-label" },
    { title: "USER", style: "user-label" },
  ];
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    fetchUsersAndTeams();
  }, []);

  const fetchUsersAndTeams = async () => {
    try {
      const [response1, response2] = await Promise.all([
        api.getUsers(),
        api.getTeams(),
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
      setOriginTeams(response2.data);
    } catch (error: any) {
      openSnackbar(
        error?.response?.data.error ?? "Failed to fetch users and teams.",
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

  const handleTeamAddModalOpen = () => {
    setAddTeamModalOpen(true);
  };

  const handleTeamAddClose = () => {
    setAddTeamModalOpen(false);
    init()
  };

  const handleTeamUpdateOpen = () => {
    if (!teamRowSelectionModel?.length) {
      openSnackbar(
        "Please select a team first.",
        "error"
      );
      return;
    }
    const index = Number(teamRowSelectionModel[0]);
    const selectedTeam = teams.find((team) => team.id === index);
    if (!selectedTeam) {
      return;
    }
    setTeamName(selectedTeam.name);
    setUpdateTeamModalOpen(true);
  };

  const handleTeamUpdateClose = () => {
    setUpdateTeamModalOpen(false);
    setTeamRowSelectionModel([]);
    init()
  };

  const handleTeamDeleteOpen = () => {
    if (!teamRowSelectionModel?.length) {
      openSnackbar(
        "Please select a team first.",
        "error"
      );
      return;
    }
    setDeleteTeamModalOpen(true);
  };

  const handleTeamDeleteClose = () => {
    setDeleteTeamModalOpen(false);
    setTeamRowSelectionModel([]);
  };

  const handleTeamAdd = async () => {
    setIsSubmitClicked(true)
    if(!teamName) return;
    try {
      await api.addTeam({ name: teamName });
      fetchUsersAndTeams();
      openSnackbar("New team added successfully.", "success");
    } catch (error: any) {
      openSnackbar(
        error?.response?.data.error ?? "Failed to add new team.",
        "error"
      );
    }
    handleTeamAddClose();
  };

  const handleTeamUpdate = async () => {
    setIsSubmitClicked(true)
    if(!teamName) return;
    try {
      if (!teamRowSelectionModel?.length) return;
      await api.updateTeam(Number(teamRowSelectionModel[0]), {
        name: teamName,
      });
      fetchUsersAndTeams();
      openSnackbar("Team updated successfully.", "success");
    } catch (error: any) {
      openSnackbar(
        error?.response?.data.error ?? "Failed to update team.",
        "error"
      );
    }
    handleTeamUpdateClose();
  };

  const handleTeamDelete = async () => {
    try {
      if (!teamRowSelectionModel?.length) return;
      await api.deleteTeam(Number(teamRowSelectionModel[0]));
      fetchUsersAndTeams();
      handleTeamDeleteClose();
      openSnackbar("Team deleted successfully.", "success");
    } catch (error: any) {
      openSnackbar(
        error?.response?.data.error ?? "Failed to delete team.",
        "error"
      );
    }
  };

  const handleAddModalOpen = () => {
    setAddUserModalOpen(true);
  };

  const handleAddClose = () => {
    setAddUserModalOpen(false);
    init()
  };

  const handleUpdateOpen = () => {
    if (!userRowSelectionModel?.length) {
      openSnackbar(
        "Please selct a user first.",
        "error"
      );
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
    init()
  };

  const handleDeleteOpen = () => {
    if (!userRowSelectionModel?.length) {
      openSnackbar(
        "Please selct a user first.",
        "error"
      );
      return;
    }
    setDeleteUserModalOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteUserModalOpen(false);
    setUserRowSelectionModel([]);
  };

  const handleAdd = async () => {
    setIsSubmitClicked(true)
    if(!userName || !role || !team) return;
    try {
      console.log(teams, team);
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
      fetchUsersAndTeams();
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
    setIsSubmitClicked(true)
    if(!userName || !role || !team) return;
    try {
      const selectedTeam = teams.find((item) => item.name === team);
      if (!userRowSelectionModel?.length || !selectedTeam) {
        return;
      }
      await api.updateUser(
        Number(userRowSelectionModel[userRowSelectionModel.length - 1]),
        { name: userName, role, team_id: selectedTeam.id }
      );
      fetchUsersAndTeams();
      openSnackbar("User updated successfully.", "success");
    } catch (error: any) {
      openSnackbar(
        error?.response?.data.error ?? "Failed to update team.",
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
      fetchUsersAndTeams();
      handleDeleteClose();
      openSnackbar("User deleted successfully.", "success");
    } catch (error: any) {
      openSnackbar(
        error?.response?.data.error ?? "Failed to delete team.",
        "error"
      );
    }
  };

  function init() {
    setUserName("");
    setRole("USER");
    setTeam("No Team");
    setTeamName("");
    setIsSubmitClicked(false)
  }

  return (
    <Box>
      <Typography
        sx={{ marginTop: "16px", marginBottom: "10px", fontStyle: "italic" }}
        variant="h4"
        gutterBottom
      >
        Team and User Management
      </Typography>
      <Grid container spacing={2} sx={{ padding: "12px" }}>
        <Grid item xs={12} sm={6}>
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
             rows={originTeams.map((item, index) => ({ index: index+1, ...item}))}
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
        </Grid>
        <Grid item xs={12} sm={6}>
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
          </Box>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={users.map((item, index) => ({index: index+1, ...item}))}
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
      </Grid>
      <Modal open={addTeamModalOpen} onClose={handleTeamAddClose}>
        <Box sx={teamStyle}>
          <Typography variant="h6" component="h2">
            Add New Team
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <TextField
              required
              label='Name'
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              size='small'
              error={teamName.length === 0 && isSubmitClicked}
              helperText={
                isSubmitClicked && teamName.length === 0
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
              label='Name'
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              size='small'
              error={teamName.length === 0 && isSubmitClicked}
              helperText={
                isSubmitClicked && teamName.length === 0
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
      </Modal>
      <Modal open={addUserModalOpen} onClose={handleAddClose}>
        <Box sx={userStyle}>
          <Typography variant="h6" component="h2">
            Add New User
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <TextField
              required
              label='Name'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              size='small'
              error={userName.length === 0 && isSubmitClicked}
              helperText={
                isSubmitClicked && userName.length === 0
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
              label='Name'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              size='small'
              error={userName.length === 0}
              helperText={
                userName.length === 0
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
    </Box>
  );
};

export default Management;

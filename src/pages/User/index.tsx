import React, { useEffect, useState } from "react";

import * as api from "api";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useSnackbar } from "providers/SnackbarProvider";
import { TeamInfo, UserInfo } from "api/types";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "name", headerName: "User Name", flex: 1 },
  { field: "team_name", headerName: "Team Name", flex: 1 },
  {
    field: "role",
    headerName: "Role",
    flex: 1,
  },
];

type User = {
  id: number,
  name: string,
  team_name: string,
  role: string
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [role, setRole] = useState("");
  const [team, setTeam] = useState("");
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [name, setName] = useState("");
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>();
  const roles = ["ADMIN", "LEAD", "USER"];
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    fetchUsersAndTeams();
  }, []);

  const handleRole = (event: SelectChangeEvent) => {
    setRole(event.target.value);
  };

  const handleTeam = (event: SelectChangeEvent) => {
    setTeam(event.target.value);
  };

  const fetchUsersAndTeams = async () => {
    try {
      const [response1, response2] = await Promise.all([
        api.getUsers(),
        api.getTeams(),
      ]);
      const formattedUsers =  await response1.data.map((user: {
        id: number,
        name: string,
        role: string,
        team_id: number,
        team: {
          name: string
        }
      }) => ({
        id: user.id,
        name: user.name,
        role: user.role,
        team_name: user.team ? user.team.name : 'No Team'
      }));
      setUsers(formattedUsers);
      setTeams([{id: -1, name: "No Team"}, ...response2.data]);
    } catch (error: any) {
      openSnackbar(error?.response?.data.error ?? "Failed to fetch users and teams.", "error");
    }
  };

  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };

  const handleAddClose = () => {
    setAddModalOpen(false);
    setName("");
    setRole("");
    setTeam("");
  };

  const handleUpdateOpen = () => {
    if(!rowSelectionModel?.length) {
      return;
    }
    const index = Number(rowSelectionModel[0])
    const selectedUser = users.find((user) => user.id === index)
    if(!selectedUser){
      return;
    }
    console.log(selectedUser.team_name)
    setName(selectedUser.name);
    setRole(selectedUser.role);
    setTeam(selectedUser.team_name);
    setUpdateModalOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateModalOpen(false);
    setRowSelectionModel([]);
    setName("");
    setRole("");
    setTeam("");
  };

  const handleDeleteOpen = () => {
    if(!rowSelectionModel?.length) {
      return;
    }
    setDeleteModalOpen(true);
  }

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
    setRowSelectionModel([]);
  };

  const handleAdd = async () => {
    try {
      const selectedTeam = teams.find((item) => item.name === team)
      if(!selectedTeam) {
        await api.addUser({ name, role, team_id: -1, password: "12345678" });
      } else {
        await api.addUser({ name, role, team_id: selectedTeam.id, password: "12345678" });
      }
      fetchUsersAndTeams();
      openSnackbar("New user added successfully.", "success");
    } catch (error: any) {
      openSnackbar(error?.response?.data.error ?? "Failed to add new user.", "error");
    }
    handleAddClose();
  };

  const handleUpdate = async () => {
    try {
      const selectedTeam = teams.find(item => item.name === team)
      if (!rowSelectionModel?.length || !selectedTeam) {
        return;
      }
      await api.updateUser(
        Number(rowSelectionModel[rowSelectionModel.length - 1]),
        { name, role, team_id: selectedTeam.id, password: "12345678" }
      );
      fetchUsersAndTeams();
      openSnackbar("User updated successfully.", "success");
    } catch (error: any) {
      openSnackbar(error?.response?.data.error ?? "Failed to update team.", "error");
    }
    handleUpdateClose();
  };

  const handleDelete = async () => {
    try {
      if (!rowSelectionModel?.length) return;
      await api.deleteUser(
        Number(rowSelectionModel[rowSelectionModel.length - 1])
      );
      fetchUsersAndTeams();
      handleDeleteClose();
      openSnackbar("User deleted successfully.", "success");
    } catch (error: any) {
      openSnackbar(error?.response?.data.error ?? "Failed to delete team.", "error");
    }
  };

  return (
    <>
      <Typography sx={{ marginTop: "12px" }} variant="h5" component="h1">
        User Management
      </Typography>
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
          rows={users}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          pageSizeOptions={[10, 50]}
        />
      </Box>
      <Modal open={addModalOpen} onClose={handleAddClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Add New User
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
            />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={handleRole}
            >
              <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
              <MenuItem value={"LEAD"}>LEAD</MenuItem>
              <MenuItem value={"USER"}>USER</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Team</InputLabel>
            <Select
              value={team.toString()}
              label="Role"
              onChange={handleTeam}
            >
              {teams.length > 0 &&
                teams.map((t, index) => {
                  return (
                    <MenuItem value={t.id} key={t.id}>
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
      <Modal open={updateModalOpen} onClose={handleUpdateClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Update Existing User
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
            />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={handleRole}
            >
              {roles.map((role, index) => {
                return (
                  <MenuItem value={role} key={index}>
                    {role}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Team</InputLabel>
            <Select
              value={team.toString()}
              label="Role"
              onChange={handleTeam}
            >
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
      <Modal open={deleteModalOpen} onClose={handleDeleteClose}>
        <Box sx={style}>
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
    </>
  );
};

export default Users;

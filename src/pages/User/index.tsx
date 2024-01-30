import React, { useEffect, useState } from "react";

import * as api from "api";
import { DataGrid, GridColDef, GridRowSelectionModel} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { TeamInfo } from "api/types";

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
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "User Name", width: 130 },
  { field: "team_id", headerName: "Team Name", width: 130 },
  {
    field: "role",
    headerName: "Role",
    width: 130,
  },
];

const MyInterview: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false)
  const [role, setRole] = useState("");
  const [team, setTeam] = useState(0);
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [name, setName]= useState("")
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>();

  useEffect(() => {
    fetchData();
  }, []);

  const handleRole = (event: SelectChangeEvent) => {
    setRole(event.target.value);
  };

  const handleTeam = (event: SelectChangeEvent) => {
    setTeam(Number(event.target.value));
  };
  
  const fetchData = async () => {
    try {
      const [response1, response2] = await Promise.all([
        api.getUsers(),
        api.getTeams(),
      ]);
      setUsers(response1.data);
      setTeams(response2.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleUpdateOpen = () => {
    setUpdateOpen(true)
  }

  const handleClose = () => {
    setOpen(false);
    setName('')
    setRole('')
    setTeam(0)
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
    setName('')
    setRole('')
    setTeam(0)
  }

  const handleAdd = async () => {
    try {
      await api.addUser({name, role, team_id: team, password: "12345678"})
      fetchData();
    } catch(error) {
      console.log(error)
    }
    handleClose()
  }

  const handleUpdate = async () => {
    try {
      if(!rowSelectionModel?.length) return;
      await api.updateUser(Number(rowSelectionModel[rowSelectionModel.length-1]), {name, role, team_id: team, password: "12345678"})
      fetchData();
    } catch(error) {
      console.log(error)
    }
    handleUpdateClose()
  }
  const handleDelete = async () => {
    try {
      if(!rowSelectionModel?.length) return;
      await api.deleteUser(Number(rowSelectionModel[rowSelectionModel.length-1]))
      fetchData();
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <>
      <h1>User Management</h1>
      <div style={{ width: "100%", textAlign: "right", marginBottom: "12px" }}>
        <Button variant="contained" onClick={handleOpen}>
          + Add
        </Button>
        <Button style={{marginLeft: "8px"}} variant="contained" color="error" onClick={handleDelete}>
          Delete
        </Button>
        <Button style={{marginLeft: "8px"}} variant="contained" color="secondary" onClick={handleUpdateOpen}>
          Update
        </Button>
      </div>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            console.log(newRowSelectionModel)
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          pageSizeOptions={[10, 10]}
          checkboxSelection
        />
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add New Member
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="outlined-size-small"
            defaultValue=""
            size="small"
          />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Role</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
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
            <InputLabel id="demo-select-small-label">Team</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
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
      <Modal open={updateOpen} onClose={handleUpdateClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Existing Member
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="outlined-size-small"
            defaultValue=""
            size="small"
          />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Role</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
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
            <InputLabel id="demo-select-small-label">Team</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
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
          <Button variant="contained" onClick={handleUpdate}>
          Update
        </Button>
        </FormControl>
        </Box>
      </Modal>
    </>
  );
};

export default MyInterview;

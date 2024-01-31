import React, { useEffect, useState } from "react";

import * as api from "api";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import { useSnackbar } from "providers/SnackbarProvider";
import { TeamInfo } from "api/types";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "name", headerName: "Team Name", flex: 1 },
];

const Teams: React.FC = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [name, setName] = useState("");
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>();
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.getTeams();
      setTeams(response.data);
    } catch (error: any) {
      openSnackbar(error?.response?.data.error ?? "Failed to fetch teams.", "error");
    }
  };

  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };

  const handleAddClose = () => {
    setAddModalOpen(false);
    setName("");
  };

  const handleUpdateOpen = () => {
    if(!rowSelectionModel?.length) {
      return;
    }
    const index = Number(rowSelectionModel[0])
    const selectedTeam = teams.find((team) => team.id === index)
    if(!selectedTeam){
      return;
    }
    setName(selectedTeam.name);
    setUpdateModalOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateModalOpen(false);
    setRowSelectionModel([]);
    setName("");
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
      await api.addTeam({ name });
      fetchTeams();
      openSnackbar("New team added successfully.", "success");
    } catch (error: any) {
      openSnackbar(error?.response?.data.error ?? "Failed to add new team.", "error");
    }
    handleAddClose();
  };

  const handleUpdate = async () => {
    try {
      if (!rowSelectionModel?.length) return;
      await api.updateTeam(
        Number(rowSelectionModel[0]),
        { name }
      );
      fetchTeams();
      openSnackbar("Team updated successfully.", "success");
    } catch (error: any) {
      openSnackbar(error?.response?.data.error ?? "Failed to update team.", "error");
    }
    handleUpdateClose();
  };

  const handleDelete = async () => {
    try {
      if (!rowSelectionModel?.length) return;
      await api.deleteTeam(
        Number(rowSelectionModel[0])
      );
      fetchTeams();
      handleDeleteClose();
      openSnackbar("Team deleted successfully.", "success");
    } catch (error: any) {
      openSnackbar(error?.response?.data.error ?? "Failed to delete team.", "error");
    }
  };

  return (
    <>
      <Typography sx={{ marginTop: "12px" }} variant="h5" component="h1">
        Team Management
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
          rows={teams}
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
            Add New Team
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
            />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120, marginTop: '12px' }} size="small">
            <Button variant="contained" onClick={handleAdd}>
              Add
            </Button>
          </FormControl>
        </Box>
      </Modal>
      <Modal open={updateModalOpen} onClose={handleUpdateClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Update Existing Team
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120, marginTop: '12px' }} size="small">
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
            />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120, marginTop: '12px'}} size="small">
            <Button variant="contained" onClick={handleUpdate}>
              Update
            </Button>
          </FormControl>
        </Box>
      </Modal>
      <Modal open={deleteModalOpen} onClose={handleDeleteClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Are you sure want to delete this team?
          </Typography>
          <Box sx={{ textAlign: "right", marginTop: '12px' }}>
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

export default Teams;

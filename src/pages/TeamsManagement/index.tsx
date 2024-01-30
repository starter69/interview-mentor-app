import React, { useEffect, useState } from "react";
import * as api from "api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  Modal,
  Box,
  Typography,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { ReferenceType } from "api/types";
import { useSnackbar } from "providers/SnackbarProvider";
import { useProfile } from "providers/ProfileProvider";

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

export default function BasicTable() {
  const [teams, setTeams] = useState<ReferenceType[]>([]);
  const [newTeam, setNewTeam] = useState<string>("");
  const [oldTeamName, setOldTeamName] = useState<string>("");
  const [updatedTeam, setUpdatedTeam] = useState<string>("");
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const { profile, setProfile } = useProfile();

  const { openSnackbar } = useSnackbar();

  const getTeams = async () => {
    try {
      const res = await api.getAllTeams();
      if (res.data) setTeams(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  const handleAddTeam = async () => {
    try {
      await api.addTeam(newTeam);
      getTeams();
      openSnackbar("Team added successfully.", "success");
    } catch (error) {
      openSnackbar("Failed to create team.", "error");
      console.log(error);
    }
  };

  const handleUpdateTeam = async (id: number) => {
    try {
      await api.updateTeam(id, updatedTeam);
      getTeams();
      handleUpdateClose();
      openSnackbar("Team name updated successfully.", "success");
    } catch (error) {
      console.log(error);
      openSnackbar("Failed to update team name.", "error");
    }
  };

  const handleDeleteTeam = async (id: number) => {
    setSelectedRow(id);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteTeam = async () => {
    try {
      await api.deleteTeam(selectedRow);
      getTeams();
      openSnackbar("Team deleted successfully.", "success");
    } catch (error) {
      console.log(error);
      openSnackbar("Failed to delete team.", "error");
    } finally {
      setDeleteConfirmationOpen(false);
    }
  };

  const handleUpdateOpen = async (team: ReferenceType) => {
    setUpdateOpen(true);
    setSelectedRow(team.id);
    setOldTeamName(team.name);
    setUpdatedTeam(team.name);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
    setUpdatedTeam("");
  };

  return (
    <div>
      {profile && profile.role === "ADMIN" && (
        <>
          <div>
            <Box>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add A Team
              </Typography>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <TextField
                  label="Name"
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value)}
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                />
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <Button variant="contained" onClick={handleAddTeam}>
                  Add
                </Button>
              </FormControl>
            </Box>
          </div>
          <TableContainer sx={{ marginTop: 5 }} component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>{team.name}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleUpdateOpen(team)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteTeam(team.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Modal open={updateOpen} onClose={handleUpdateClose}>
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Update Team Name
              </Typography>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <TextField
                  label="Name"
                  value={updatedTeam}
                  onChange={(e) => setUpdatedTeam(e.target.value)}
                  id="outlined-size-small"
                  defaultValue={oldTeamName}
                  size="small"
                />
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <Button
                  variant="contained"
                  onClick={() => handleUpdateTeam(selectedRow)}
                >
                  Update
                </Button>
              </FormControl>
            </Box>
          </Modal>
          <Dialog
            open={deleteConfirmationOpen}
            onClose={() => setDeleteConfirmationOpen(false)}
          >
            <DialogTitle>Delete Team</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this team?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={() => setDeleteConfirmationOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={confirmDeleteTeam}
                color="error"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {profile && profile.role !== "ADMIN" && (
        <div>
          <h1>Access Denied. You don't have permission to access.</h1>
        </div>
      )}
    </div>
  );
}

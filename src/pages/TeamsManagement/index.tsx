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
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { ReferenceType } from "api/types";

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
  const [updatedTeam, setUpdatedTeam] = useState<string>("");
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number>(0);

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

  const handleAddTeam = () => {
    try {
      api.addTeam(newTeam);
    } catch (error) {
      console.log(error);
    }
    getTeams();
  };

  const handleUpdateTeam = (id: number) => {
    api.updateTeam(id, updatedTeam);
    handleUpdateClose();
  };

  const handleDeleteTeam = (id: number) => {
    api.deleteTeam(id);
    getTeams();
  };

  const handleUpdateOpen = (id: number) => {
    setUpdateOpen(true);
    setSelectedRow(id);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
    setUpdatedTeam("");
  };

  return (
    <div>
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
                    onClick={() => handleUpdateOpen(team.id)}
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
              defaultValue=""
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
    </div>
  );
}

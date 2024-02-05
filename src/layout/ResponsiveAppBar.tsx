import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { useProfile } from "providers/ProfileProvider";

const userPages = ["Interviews", "My Interviews"];
const adminPages = [...userPages, "Management"];
const settings = ["Profile"];

function ResponsiveAppBar() {
  const navigator = useNavigate();
  const { profile, setProfile } = useProfile();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickLink = (link: string) => () => {
    handleCloseNavMenu();
    handleCloseUserMenu();
    navigator(`/${link.toLowerCase().replace(" ", "-")}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigator("/login");
    handleCloseUserMenu();
    setProfile(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            onClick={handleClickLink("interviews")}
            sx={{
              display: { xs: "none", md: "flex" },
              cursor: "pointer",
              marginRight: 1,
            }}
          >
            <img
              src="/logo512.png"
              alt="Interview Mentor"
              width={40}
              height={40}
            />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={handleClickLink("interviews")}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            IM
          </Typography>
          {profile && profile.role === "ADMIN" && (
            <>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {adminPages.map((page) => (
                    <MenuItem key={page} onClick={handleClickLink(page)}>
                      {page}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </>
          )}
          {profile && profile.role !== "ADMIN" && (
            <>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {userPages.map((page) => (
                    <MenuItem key={page} onClick={handleClickLink(page)}>
                      {page}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </>
          )}
          <Box
            onClick={handleClickLink("interviews")}
            sx={{
              display: { xs: "flex", md: "none" },
              cursor: "pointer",
              marginRight: 1,
            }}
          >
            <img
              src="/logo512.png"
              alt="Interview Mentor"
              width={40}
              height={40}
            />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
            onClick={handleClickLink("interviews")}
          >
            Interview Mentor
          </Typography>
          {profile && profile.role === "ADMIN" && (
            <>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {adminPages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleClickLink(page)}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <Button onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={profile.name}
                    src="/static/images/avatar/2.jpg"
                  />
                  <Typography color="white" sx={{ marginLeft: "5px" }}>
                    {profile.name}
                  </Typography>
                </Button>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleClickLink(setting)}>
                      {setting}
                    </MenuItem>
                  ))}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            </>
          )}
          {profile && profile.role !== "ADMIN" && (
            <>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {userPages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleClickLink(page)}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <Button onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={profile.name}
                    src="/static/images/avatar/2.jpg"
                  />
                  <Typography color="white" sx={{ marginLeft: "5px" }}>
                    {profile.name}
                  </Typography>
                </Button>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleClickLink(setting)}>
                      {setting}
                    </MenuItem>
                  ))}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;

import React, { FC, useEffect, useState } from "react";
import styles from "./Header.module.scss";

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
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import LogoDevIcon from "@mui/icons-material/LogoDev";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import { authLogout } from "src/store/actions/AuthAction";
import { profile } from "src/store/actions/user/UserProfileAction";
import jwtDecode from "jwt-decode";
import { IAuthModel } from "src/models/IAuthModel";
import { empty } from "src/types/empty";

const pages = [
  {
    title: "Конференция",
    url: "/conference",
    access: "all",
  },
  {
    title: "Архив покупок",
    url: "/archive",
    access: "all",
  },
  {
    title: "Кабинет администратора",
    url: "/admin",
    access: "admin",
  },
  {
    title: "Кабинет блогера",
    url: "/blogger",
    access: "blogger",
  },
  {
    title: "Мессенджер",
    url: "/messenger",
    access: "all",
  }
];

const settings = [
  {
    title: "Профиль",
    url: "/profile",
  },
  {
    title: "Конференция",
    url: "/conference",
  },
  {
    title: "Архив покупок",
    url: "/archive",
  },
];

const Header: FC<any> = () => {
  const authSelector = useAppSelector((selector) => selector.authReducer);
  const userProfileSelector = useAppSelector(
    (selector) => selector.userProfileReducer
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const [auth, setAuth] = useState<IAuthModel | empty>(null);

  const getPageByRole = (role: string) => {
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].access === role) {
        return pages[i];
      }
    }

    return null;
  };

  useEffect(() => {
    if (authSelector.access_token) {
      setAuth(jwtDecode(authSelector.access_token) as IAuthModel);
      dispatch(profile());
    }
  }, [authSelector.access_token]);

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

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LogoDevIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            VCS
          </Typography>

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
              {authSelector.access_token &&
                pages
                  .filter((page) => page.access === "all")
                  .map((page) => {
                    return (
                      <MenuItem
                        key={page.title}
                        onClick={() => {
                          navigate(page.url);
                          setAnchorElNav(null);
                        }}
                      >
                        <Typography textAlign="center">{page.title}</Typography>
                      </MenuItem>
                    );
                  })}

              {authSelector.access_token &&
                auth &&
                auth.roles &&
                auth.roles
                  .filter(
                    (role) => getPageByRole(role.title as string) !== null
                  )
                  .map((item) => {
                    const page = getPageByRole(item.title as string);

                    return (
                      <MenuItem
                        key={page?.title}
                        onClick={() => {
                          navigate(page?.url as string);
                          setAnchorElNav(null);
                        }}
                      >
                        <Typography textAlign="center">
                          {page?.title}
                        </Typography>
                      </MenuItem>
                    );
                  })}
            </Menu>
          </Box>
          <LogoDevIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            VCS
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {authSelector.access_token &&
              pages
                .filter((item) => item.access === "all")
                .map((page) => {
                  return (
                    <Button
                      key={page.title}
                      onClick={() => {
                        navigate(page.url);
                        setAnchorElNav(null);
                      }}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page.title}
                    </Button>
                  );
                })}

            {authSelector.access_token &&
              auth &&
              auth.roles &&
              auth.roles.filter((role) => getPageByRole(role.title as string) !== null).map((item) => {
                const page = getPageByRole(item.title as string);

                return (
                  <Button
                    key={page?.title}
                    onClick={() => {
                      navigate(page?.url as string);
                      setAnchorElNav(null);
                    }}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page?.title}
                  </Button>
                );
              })}
          </Box>
          {authSelector.access_token && (
            <Box sx={{ flexGrow: 0 }}>
              <Button color="inherit">
                {userProfileSelector.nickname.length > 0
                  ? userProfileSelector.nickname
                  : "Nickname"}
              </Button>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
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
                  <MenuItem
                    key={setting.title}
                    onClick={() => {
                      navigate(setting.url);
                      setAnchorElUser(null);
                    }}
                  >
                    <Typography textAlign="center">{setting.title}</Typography>
                  </MenuItem>
                ))}

                <MenuItem
                  onClick={() => {
                    dispatch(authLogout(authSelector.refresh_token));
                    setAnchorElUser(null);
                  }}
                >
                  <Typography textAlign="center">Выход</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
          {!authSelector.access_token && (
            <Box sx={{ flexGrow: 0 }}>
              <Button
                color="inherit"
                onClick={() => {
                  navigate("/auth/sign-in");
                }}
              >
                LOGIN
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default React.memo(Header);

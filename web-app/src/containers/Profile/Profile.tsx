import React, { FC, useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { profile } from "src/store/actions/user/UserProfileAction";
import { useNavigate } from "react-router-dom";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CircularIndeterminate from "src/components/CircularIndeterminate";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import Button from "@mui/material/Button";
import { MonetizationOn } from "@mui/icons-material";
import AccountRefill from "src/components/ProfilePage/AccountRefill/AccountRefill";

const Profile: FC<any> = () => {
  const userProfileSelector = useAppSelector(
    (selector) => selector.userProfileReducer
  );
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(true);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(profile());
  }, []);

  useEffect(() => {
    if (!open) {
      dispatch(profile());
    }
  }, [open]);

  return (
    <>
      <div className="row">
        <AccountRefill open={open} setOpen={setOpen} />
        <div className="col s6 offset-s3">
          <h1>Профиль пользователя</h1>
          <div className="card blue darken-1">
            <div className="card-content white-text">
              <div>
                <div className="input-field">
                  <span>Никнейм:</span>
                  <input
                    id="nickname"
                    type="text"
                    name="nickname"
                    value={userProfileSelector.nickname}
                    className="yellow-input"
                    readOnly
                  />
                </div>

                <div className="input-field">
                  <span>Email:</span>
                  <input
                    id="email"
                    type="text"
                    name="email"
                    value={userProfileSelector.email}
                    className="yellow-input"
                    readOnly
                  />
                </div>

                <div className="input-field">
                  <span>Счёт:</span>
                  <input
                    id="email"
                    type="text"
                    name="tokens"
                    value={userProfileSelector.tokens}
                    className="yellow-input"
                    readOnly
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpen(true);
                    }}
                    endIcon={<MonetizationOn />}
                  >
                    Пополнить
                  </Button>
                </div>
                <div
                  className="input-field"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span>Старый пароль</span>
                  <TextField
                    sx={{
                      border: "none",
                      width: "100%",
                      "&:hover fieldset": {
                        border: "none !important",
                      },
                      fieldset: {
                        border: "none !important",
                      },
                    }}
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      // <-- This is where the toggle button is added.
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div
                  className="input-field"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span>Новый пароль</span>
                  <TextField
                    sx={{
                      border: "none",
                      width: "100%",
                      "&:hover fieldset": {
                        border: "none !important",
                      },
                      fieldset: {
                        border: "none !important",
                      },
                    }}
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      // <-- This is where the toggle button is added.
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="card-action">
              <button className="btn grey lighten-1 black-text" disabled>
                Изменить
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Profile);

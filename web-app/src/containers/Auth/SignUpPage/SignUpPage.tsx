import React, { FC, useEffect, useState } from "react";
import styles from "./SignUpPage.module.css";
import { useNavigate } from "react-router-dom";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CircularIndeterminate from "src/components/CircularIndeterminate";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import { authSignUp } from "src/store/actions/AuthAction";
import store from "src/store/store";

const SignUpPage: FC<any> = () => {
  const authSelector = useAppSelector((selector) => selector.authReducer);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(true);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: ""
  });

  const onSignUp = (data: any) => {
    dispatch(authSignUp(form));
  };

  const onChange = (data: any) => {
    setForm({
      ...form,
      [data.target.name]: data.target.value,
    });
  };

  useEffect(() => {
    if(store.getState().authReducer.access_token){
      navigate("/profile");
    }
  }, [store.getState().authReducer.access_token]);

  return (
    <>
      <div className="row">
        <div className="col s6 offset-s3">
          <h1>Регистрация</h1>
          <div className="card blue darken-1">
            {authSelector.isLoading && <CircularIndeterminate />}

            <div className="card-content white-text">
              <div>
                <div className="input-field">
                  <span>Никнейм</span>
                  <input
                    id="nickname"
                    type="text"
                    name="nickname"
                    className="yellow-input"
                    onChange={onChange}
                  />
                </div>

                <div className="input-field">
                  <span>Email</span>
                  <input
                    id="email"
                    type="text"
                    name="email"
                    className="yellow-input"
                    onChange={onChange}
                  />
                </div>

                <div
                  className="input-field"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span>Пароль</span>
                  <TextField
                    name="password"
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
                    onChange={onChange}
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
              <button
                className="btn yellow darken-4"
                style={{ marginRight: 10 }}
                onClick={() => {
                  navigate("/auth/sign-in");
                }}
              >
                Назад
              </button>
              <button 
              className="btn grey lighten-1 black-text"
              onClick={onSignUp}
              >
                Зарегистрироваться
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(SignUpPage);

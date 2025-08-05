import React, { FC, useState } from "react";
import styles from "./CreateBlogger.module.scss";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import { createBlogger } from "src/store/actions/admin/AdminAction";
import CircularIndeterminate from "src/components/CircularIndeterminate/CircularIndeterminate";

interface ICreateBloggerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& input": {
    borderBottom: "none !important",
    "&:focus": {
      borderBottom: "none !important",
    },
  },
}));

const CreateBlogger: FC<ICreateBloggerProps> = ({ open, setOpen }) => {
  const adminSelector = useAppSelector((reducer) => reducer.adminReducer);
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
  });

  const onChange = (data: any) => {
    setForm({
      ...form,
      [data.target.name]: data.target.value,
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    dispatch(createBlogger(form));
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        { adminSelector.isLoading && <CircularIndeterminate />}
        <DialogTitle>Создание блогера</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Заполните следующие обязательные поля для создания блогера. Важно
            запомнить email и пароль созданного блогера, чтобы пользователь смог
            зайти по этим данным на сайт.
          </DialogContentText>
          <div className="input-field">
            <span>Nickname</span>
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
          <div className="input-field">
            <span>Пароль</span>
            <input
              id="password"
              type="text"
              name="password"
              className="yellow-input"
              onChange={onChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleCreate}>Создать блогера</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default React.memo(CreateBlogger);

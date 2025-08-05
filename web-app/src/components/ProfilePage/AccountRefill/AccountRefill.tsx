import React, { FC, useState, useEffect } from "react";
import styles from "./AccountRefill.module.scss";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import CircularIndeterminate from "src/components/CircularIndeterminate/CircularIndeterminate";
import { accountRefill, profile } from "src/store/actions/user/UserProfileAction";
import messageQueueAction from "src/store/actions/MessageQueueAction";

export interface IAccountRefillProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccountRefill: FC<IAccountRefillProps> = ({ open, setOpen }) => {
  const userProfileSelector = useAppSelector(
    (reducer) => reducer.userProfileReducer
  );
  const dispatch = useAppDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const [form, setForm] = useState({
    tokens: "",
  });

  const onChange = (data: any) => {
    setForm({
      ...form,
      [data.target.name]: data.target.value,
    });
  };

  const refill = () => {
    if(form.tokens.length === 0){
        dispatch(messageQueueAction.addMessage(null, "error", "Необходимо добавить количество токенов для пополнения"));
        return;
    }
    dispatch(accountRefill({
        tokens: form.tokens as unknown as number
    }, handleClose));
  };

  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose}>
          {userProfileSelector.isLoading && <CircularIndeterminate />}
          <DialogTitle>Пополнение счёта</DialogTitle>
          <DialogContent>
            <DialogContentText></DialogContentText>
            <br />
            <div className="input-field">
              <span>Количество токенов</span>
              <input
                id="tokens"
                type="number"
                name="tokens"
                className="yellow-input"
                onChange={onChange}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Назад</Button>
            <Button onClick={refill}>Пополнить</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default React.memo(AccountRefill);

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
import messageQueueAction from "src/store/actions/MessageQueueAction";
import AdminUserAction from "src/store/actions/admin/UserAction";

export interface IAddTokenProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: (tokens: number, cb: () => void) => void;
}

const AddToken: FC<IAddTokenProps> = ({
  open,
  setOpen,
  action,
}) => {
  const adminSlice = useAppSelector((s) => s.adminReducer);
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

  const handlerAdd = () => {
    if (form.tokens.length === 0) {
      dispatch(
        messageQueueAction.addMessage(
          null,
          "error",
          "Необходимо добавить количество токенов для пополнения"
        )
      );
      return;
    }
    
    action(Number(form.tokens), () => {
        handleClose();
    });
  };

  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose}>
          {adminSlice.isLoading && <CircularIndeterminate />}
          <DialogTitle>Подарить токены</DialogTitle>
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
            <Button onClick={handlerAdd}>Подарить</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default React.memo(AddToken);

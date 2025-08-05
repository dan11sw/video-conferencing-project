import React, { FC, memo } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./SearchUser.module.scss";
import socket from "src/socket";
import { useAppDispatch } from "src/hooks/redux.hook";
import messageQueueAction from "src/store/actions/MessageQueueAction";

export interface ISearchUserProps {
  setView: React.Dispatch<React.SetStateAction<boolean>>;
  onCreateChat: () => void;
}

/**
 * Поиск пользователя
 * @param param0
 * @returns
 */
const SearchUser: FC<ISearchUserProps> = ({ setView, onCreateChat }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(true);
  const [form, setForm] = React.useState({
    text: "",
    nickname: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setView(false);
  };

  const handleCreateChat = () => {
    socket.once("error", ({ message }) => {
      dispatch(messageQueueAction.addMessage(null, "error", message));
    });

    socket.emit("create_chat", {
      text: form.text,
      nickname: form.nickname,
    });

    onCreateChat();
    handleClose();
  };

  const onChange = (data: any) => {
    setForm({
      ...form,
      [data.target.name]: data.target.value,
    });
  };

  return (
    <>
      <div>
        <Dialog open={true} onClose={handleClose} fullWidth maxWidth={"sm"}>
          <DialogTitle>Отправить сообщение</DialogTitle>
          <DialogContent>
            <div className={styles.container}>
              <div className={styles.controlContainer}>
                <span className={styles.controlLabel}>Никнейм *</span>
                <input
                  className={styles.controlInput}
                  required={true}
                  id="nickname"
                  type="text"
                  name="nickname"
                  onChange={onChange}
                />
              </div>
              <div className={styles.controlContainer}>
                <span className={styles.controlLabel}>Сообщение *</span>
                <textarea
                  className={styles.controlTextarea}
                  rows={11}
                  required={true}
                  id="text"
                  name="text"
                  onChange={onChange}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button onClick={handleCreateChat}>Отправить</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default memo(SearchUser);

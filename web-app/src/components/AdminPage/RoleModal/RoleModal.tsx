import React, { FC } from "react";
import styles from "./RoleModal.module.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ChangeRole from "../ChangeRole/ChangeRole";
import CircularIndeterminate from "src/components/CircularIndeterminate/CircularIndeterminate";
import { IRoleModel } from "src/models/IUserInfoModel";
import { useAppSelector } from "src/hooks/redux.hook";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface IRoleModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  users: ({
    users_id: number;
    nickname: string;
    role: IRoleModel;
  } | null)[];
}

const RoleModal: FC<IRoleModal> = ({ open, setOpen, users }) => {
  const adminSelector = useAppSelector((reducer) => reducer.adminReducer);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {adminSelector.isLoading && <CircularIndeterminate />}
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Изменение роли пользователя
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 3 }}>
            {users
              .filter((item) => item !== null)
              .map((item) => {
                return (
                  <div
                    key={item?.users_id}
                  >
                    <p>Nickname: {item?.nickname}</p>
                    <ChangeRole role={item?.role as IRoleModel} users_id={item?.users_id || -1} />
                  </div>
                );
              })}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default React.memo(RoleModal);

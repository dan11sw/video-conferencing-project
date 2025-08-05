import React, { FC } from "react";
import styles from "./ChangeRole.module.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { IRoleModel } from "src/models/IUserInfoModel";
import CircularIndeterminate from "src/components/CircularIndeterminate/CircularIndeterminate";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import { changeRole } from "src/store/actions/admin/AdminAction";

let roles = new Map([
  ["Пользователь", "user"],
  ["Блогер", "blogger"],
  ["Админ", "admin"],
]);

interface IChangeRoleProps {
  users_id: number;
  role: IRoleModel;
}

const ChangeRole: FC<IChangeRoleProps> = ({ role, users_id }) => {
  const adminSelector = useAppSelector((reducer) => reducer.adminReducer);
  const dispatch = useAppDispatch();
  const [title, setTitle] = React.useState(role.title);

  const handleChange = (event: SelectChangeEvent) => {
    setTitle(event.target.value);
  };

  const handleClick = () => {
    dispatch(changeRole({
      users_id_goal: users_id,
      new_role_title: title,
      old_role_title: role.title
    }));
  };

  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={title}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value={"user"}>Пользователь</MenuItem>
          <MenuItem value={"blogger"}>Блогер</MenuItem>
        </Select>
        <FormHelperText>Роль пользователя</FormHelperText>
        <Button onClick={handleClick}>Изменить</Button>
      </FormControl>
    </>
  );
};

export default React.memo(ChangeRole);

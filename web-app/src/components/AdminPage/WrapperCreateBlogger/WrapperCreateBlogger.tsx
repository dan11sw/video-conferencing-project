import React, { FC } from "react";
import styles from "./WrapperCreateBlogger.module.css";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Switch from "@mui/material/Switch";
import SpeedDial, { SpeedDialProps } from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateBlogger from "src/components/AdminPage/CreateBlogger/CreateBlogger";

const actions = [
  { icon: <AddCircleIcon />, name: "Создать нового блогера" }
];

const WrapperCreateBlogger: FC<any> = () => {
  const [open, setOpen] = React.useState<boolean>(false);

  const [direction, setDirection] =
    React.useState<SpeedDialProps["direction"]>("up");
  const [hidden, setHidden] = React.useState(false);

  const handleDirectionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDirection(
      (event.target as HTMLInputElement).value as SpeedDialProps["direction"]
    );
  };

  const handleHiddenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHidden(event.target.checked);
  };

  return (
    <Box sx={{ height: 320, transform: "translateZ(0px)", flexGrow: 1 }}>
      <CreateBlogger open={open} setOpen={setOpen} />
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              setOpen(!open);
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default React.memo(WrapperCreateBlogger);
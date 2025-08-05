import React, { FC, useState, useEffect } from "react";
import styles from "./BloggerPage.module.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ExplorerContent from "src/components/Archive/ExplorerContent/ExplorerContent";
import FavouriteContent from "src/components/Archive/FavouriteContent/FavouriteContent";
import PurchasedContent from "src/components/Archive/PurchasedContent/PurchasedContent";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CreateContent from "src/components/BloggerPage/CreateContent/CreateContent";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import { getContent } from "src/store/actions/blogger/BloggerAction";
import BloggerExploreContent from "src/components/BloggerPage/BloggerExploreContent/BloggerExploreContent";
import BloggerService from "src/components/BloggerPage/BloggerService";

const actions = [
  { icon: <NoteAddIcon />, name: "Добавить новый контент", id: 1 },
];

const BloggerPage: FC<any> = () => {
  const userSelector = useAppSelector((s) => s.userProfileReducer);
  const bloggerSelector = useAppSelector((reducer) => reducer.bloggerReducer);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState("1");
  const [open, setOpen] = useState<boolean>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Контент" value="1" />
            <Tab label="Настройки услуг" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <BloggerExploreContent />
        </TabPanel>
        <TabPanel value="2">
          <BloggerService blogger_id={userSelector.id} />
        </TabPanel>
      </TabContext>

      <CreateContent open={open} setOpen={setOpen} />
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              if (action.id === 1) {
                setOpen(true);
              }
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default React.memo(BloggerPage);

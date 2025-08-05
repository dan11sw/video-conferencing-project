import React, { FC } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import styles from "./Archive.module.scss";
import ExplorerContent from "src/components/Archive/ExplorerContent/ExplorerContent";
import FavouriteContent from "src/components/Archive/FavouriteContent/FavouriteContent";
import PurchasedContent from "src/components/Archive/PurchasedContent/PurchasedContent";

const Archive: FC<any> = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Контент" value="1" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <ExplorerContent />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default React.memo(Archive);

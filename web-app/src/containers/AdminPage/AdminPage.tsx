import React, { FC, useEffect } from "react";
import styles from "./AdminPage.module.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ExplorerContent from "src/components/Archive/ExplorerContent/ExplorerContent";
import FavouriteContent from "src/components/Archive/FavouriteContent/FavouriteContent";
import PurchasedContent from "src/components/Archive/PurchasedContent/PurchasedContent";
import UserList from "src/components/AdminPage/UserList/UserList";
import WrapperCreateBlogger from "src/components/AdminPage/WrapperCreateBlogger/WrapperCreateBlogger";
import TransferList from "src/components/AdminPage/TransferList";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import AdminTransferTokenAction from "src/store/actions/admin/TransferTokenAction";
import UserStatistics from "src/components/AdminPage/UserStatistics";

const AdminPage: FC<any> = () => {
  const transferTokenSelector = useAppSelector(
    (s) => s.adminTransferTokenReducer
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(AdminTransferTokenAction.getTransferToken());
  }, []);
  
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Пользователи системы" value="1" />
            <Tab label="Журнал транзакций" value="2" />
            <Tab label="Список пользователей" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <UserList />
        </TabPanel>
        <TabPanel value="2">
          <TransferList transfers={transferTokenSelector.transfers} />
        </TabPanel>
        <TabPanel value="3">
          <UserStatistics />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default React.memo(AdminPage);

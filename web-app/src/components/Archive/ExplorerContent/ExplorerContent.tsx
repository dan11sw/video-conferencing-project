import React, { FC, useEffect, useState } from "react";
import ImageList from "@mui/material/ImageList";
import ContentItem from "../ContentItem/ContentItem";
import styles from "./ExplorerContent.module.scss";
import { useAppSelector, useAppDispatch } from "src/hooks/redux.hook";
import { getContent } from "src/store/actions/user/UserContentAction";
import { IGetContentModel } from "src/models/IContentModel";
import ViewContent from "../ViewContent";
import ContentBuy from "../ContentBuy/ContentBuy";

const ExplorerContent: FC<any> = () => {
  const userContentSelector = useAppSelector(
    (reducer) => reducer.userContentReducer
  );
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [openBuy, setOpenBuy] = useState(false);
  const [select, setSelect] = useState<IGetContentModel | null>(null);
  const [selectBuy, setSelectBuy] = useState<IGetContentModel | null>(null);

  useEffect(() => {
    dispatch(getContent());
  }, []);

  useEffect(() => {
    if (select) {
      setOpen(true);
    }
  }, [select]);

  useEffect(() => {
    if (selectBuy) {
      setOpenBuy(true);
    }
  }, [selectBuy]);

  return (
    <>
      <ImageList sx={{ width: "100%", height: "100%" }} gap={16} cols={4}>
        {userContentSelector.content.map((item) => (
          <ContentItem
            content={item}
            select={select}
            setSelect={setSelect}
            setSelectBuy={setSelectBuy}
          />
        ))}
      </ImageList>
      {select && (
        <ViewContent
          open={open}
          setOpen={setOpen}
          content={select}
          setSelect={setSelect}
        />
      )}

      {selectBuy && (
        <ContentBuy
          open={openBuy}
          setOpen={setOpenBuy}
          content={selectBuy}
          setSelect={setSelectBuy}
        />
      )}
    </>
  );
};

export default React.memo(ExplorerContent);

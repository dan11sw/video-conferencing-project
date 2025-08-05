import React, { FC, useState, useEffect } from "react";
import styles from "./BloggerExploreContent.module.scss";
import { useAppSelector, useAppDispatch } from "src/hooks/redux.hook";
import { getContent } from "src/store/actions/blogger/BloggerAction";
import ImageList from "@mui/material/ImageList";
import BloggerExploreItem from "../BloggerExploreItem/BloggerExploreItem";
import ViewContent from "src/components/Archive/ViewContent/ViewContent";
import { IGetContentModel } from "src/models/IContentModel";
import EditContent from "../EditContent/EditContent";
import DeleteContent from "../DeleteContent/DeleteContent";

const BloggerExploreContent: FC<any> = () => {
  const bloggerSelector = useAppSelector((reducer) => reducer.bloggerReducer);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [select, setSelect] = useState<IGetContentModel | null>(null);
  const [selectEdit, setSelectEdit] = useState<IGetContentModel | null>(null);
  const [selectDelete, setSelectDelete] = useState<IGetContentModel | null>(
    null
  );

  useEffect(() => {
    dispatch(getContent());
  }, []);

  useEffect(() => {
    if (select) {
      setOpen(true);
    }
  }, [select]);

  useEffect(() => {
    if (selectEdit) {
      setOpenEdit(true);
    }
  }, [selectEdit]);

  useEffect(() => {
    if (selectDelete) {
      setOpenDelete(true);
    }
  }, [selectDelete]);

  return (
    <>
      <ImageList sx={{ width: "100%", height: "100%" }} gap={16} cols={4}>
        {bloggerSelector.content.map((item) => {
          return (
            <BloggerExploreItem
              item={item}
              select={select}
              setSelect={setSelect}
              setSelectEdit={setSelectEdit}
              setSelectDelete={setSelectDelete}
            />
          );
        })}
      </ImageList>

      {select && (
        <ViewContent
          open={open}
          setOpen={setOpen}
          content={select}
          setSelect={setSelect}
        />
      )}

      {selectEdit && (
        <EditContent
          open={openEdit}
          setOpen={setOpenEdit}
          content={selectEdit}
          setSelect={setSelectEdit}
        />
      )}

      {selectDelete && (
        <DeleteContent
          open={openDelete}
          setOpen={setOpenDelete}
          content={selectDelete}
          setSelect={setSelectDelete}
        />
      )}
    </>
  );
};

export default React.memo(BloggerExploreContent);

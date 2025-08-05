import { FC, memo, useEffect, useState } from "react";
import styles from "./UserInfo.module.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CircularIndeterminate from "src/components/CircularIndeterminate";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import Button from "@mui/material/Button";
import { MonetizationOn } from "@mui/icons-material";
import AdminUserAction from "src/store/actions/admin/UserAction";
import TransferList from "../TransferList";
import classNames from "classnames";
import AddToken from "../AddToken";
import {
  addToken,
  deleteToken,
  transferToken,
} from "src/store/actions/admin/AdminAction";
import TransferToken from "../TransferToken";
import BloggerService from "src/components/BloggerPage/BloggerService";
import { getAccessServices, getCurrentServices } from "src/store/actions/blogger/BloggerAction";

const UserInfo: FC<any> = () => {
  const { id } = useParams();
  const userSelector = useAppSelector((s) => s.adminUserReducer);
  const dispatch = useAppDispatch();
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const addAction = (tokens: number, cb: () => void) => {
    dispatch(
      addToken(
        {
          receiver_id: Number(id),
          tokens: tokens,
        },
        cb
      )
    );
  };

  const deleteAction = (tokens: number, cb: () => void) => {
    dispatch(
      deleteToken(
        {
          receiver_id: Number(id),
          tokens: tokens,
        },
        cb
      )
    );
  };

  const transferTokenAction = (
    receiver_id: number,
    tokens: number,
    cb: () => void
  ) => {
    dispatch(
      transferToken(
        {
          sender_id: userSelector.user?.user.id,
          receiver_id: receiver_id,
          tokens: tokens,
        },
        cb
      )
    );
  };

  const handleAddClick = () => {
    setAddOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteOpen(true);
  };

  const handleTransferClick = () => {
    setTransferOpen(true);
  };

  useEffect(() => {
    if (id) {
      dispatch(
        AdminUserAction.getUser({
          user_id: Number(id),
        })
      );
    }
  }, [id]);

  useEffect(() => {
    if (
      userSelector.user &&
      userSelector.user.roles.filter((item) => {
        return item.title !== "blogger";
      }).length > 0
    ) {
      dispatch(getAccessServices(userSelector.user.user.id));
      dispatch(getCurrentServices(userSelector.user.user.id));
    }
  }, [userSelector.user]);

  return (
    <>
      <div className={styles.container}>
        <div className={classNames("row", styles.rowWrapper)}>
          <div className="col s6 offset-s3">
            <h1>Информация о пользователе</h1>
            <div className="card blue darken-1">
              <div className="card-content white-text">
                <div>
                  <div className="input-field">
                    <span>Идентификатор (id):</span>
                    <input
                      id="id"
                      type="number"
                      name="id"
                      value={userSelector.user?.user.id || ""}
                      className="yellow-input"
                      readOnly
                    />
                  </div>
                  <div className="input-field">
                    <span>Никнейм:</span>
                    <input
                      id="nickname"
                      type="text"
                      name="nickname"
                      value={
                        userSelector.user?.user.users_data[0].nickname || ""
                      }
                      className="yellow-input"
                      readOnly
                    />
                  </div>

                  <div className="input-field">
                    <span>Email:</span>
                    <input
                      id="email"
                      type="text"
                      name="email"
                      value={userSelector.user?.user.email || ""}
                      className="yellow-input"
                      readOnly
                    />
                  </div>

                  <div className="input-field">
                    <span>Роль:</span>
                    <input
                      id="roles"
                      type="text"
                      name="roles"
                      value={userSelector.user?.roles
                        .map((item) => item.title)
                        .join("; ")}
                      className="yellow-input"
                      readOnly
                    />
                  </div>

                  <div className="input-field">
                    <span>Счёт: </span>
                    <input
                      id="email"
                      type="text"
                      name="tokens"
                      value={userSelector.user?.user.users_data[0].tokens}
                      className="yellow-input"
                      readOnly
                    />
                    <div className={styles.controls}>
                      <Button
                        variant="contained"
                        endIcon={<MonetizationOn />}
                        onClick={handleAddClick}
                      >
                        Добавить токены
                      </Button>
                      <Button
                        variant="contained"
                        endIcon={<MonetizationOn />}
                        onClick={handleTransferClick}
                      >
                        Переслать токены
                      </Button>
                      <Button
                        variant="contained"
                        endIcon={<MonetizationOn />}
                        onClick={handleDeleteClick}
                      >
                        Удалить токены
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {userSelector.user &&
          userSelector.user.roles.filter((item) => {
            return item.title !== "blogger";
          }).length > 0 && (
            <BloggerService blogger_id={userSelector.user.user.id} />
          )}
        {userSelector.user && userSelector.user.transfers.length > 0 && (
          <div className={styles.transferContainer}>
            <TransferList transfers={userSelector.user.transfers} />
          </div>
        )}
      </div>
      {userSelector.user && (
        <AddToken
          users_id={userSelector.user.user.id}
          open={addOpen}
          setOpen={setAddOpen}
          action={addAction}
          title="Добавить токены"
          subtitle="Добавить"
        />
      )}
      {userSelector.user && (
        <AddToken
          users_id={userSelector.user?.user.id}
          open={deleteOpen}
          setOpen={setDeleteOpen}
          action={deleteAction}
          title="Удалить токены"
          subtitle="Удалить"
        />
      )}
      {userSelector.user && (
        <TransferToken
          users_id={userSelector.user.user.id}
          open={transferOpen}
          setOpen={setTransferOpen}
          action={transferTokenAction}
        />
      )}
    </>
  );
};

export default memo(UserInfo);

import { useEffect, useRef, useState, memo } from 'react';
import socket from 'src/socket';
import ACTIONS from 'src/constants/actions';
import { useNavigate } from 'react-router';
import { v4 } from 'uuid';
import styles from './RoomView.module.scss';
import { useAppSelector } from 'src/hooks/redux.hook';
import { Button } from '@mui/material';
import jwtDecode from 'jwt-decode';

const RoomView = () => {
    const authSelector = useAppSelector((selector) => selector.authReducer);
    const navigate = useNavigate();
    const [rooms, updateRooms] = useState([]);
    const rootNode = useRef();

    useEffect(() => {
        socket.emit("set_authorization_data", {
            access_token: authSelector.access_token,
        });
    }, []);

    useEffect(() => {
        socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] }) => {
            if (rootNode && rootNode.current) {
                updateRooms(rooms);
            }
        });
    }, []);

    useEffect(() => {
        socket.on("authorization_success", () => {
            socket.on(ACTIONS.CREATE_SUCCESS, ({ room }) => {
                navigate(`/room/${room.link}`);
            });
        })
    }, []);

    useEffect(() => {
        socket.on("error", ({ message }) => {
            console.log(message);
        });
    }, [])

    const createRoomHandler = () => {
        socket.emit(ACTIONS.CREATE);
    };

    const joinRoomHandler = (room) => {
        navigate(`/room/${room.link}`);
    };

    const checkAccess = () => {
        const roles = Array.from(jwtDecode(authSelector.access_token).roles);
        let flag = false;

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].title === 'blogger') {
                flag = true;
                break;
            }
        }

        return flag;
    }

    return (
        <>
            <div ref={rootNode} className={styles.container}>
                <h1>Список доступных комнат</h1>
                <ul className={styles.roomContainer}>
                    {
                        rooms.map(room => (
                            <li key={room.link} className={styles.roomElement}>
                                <h4>{room.nickname}</h4>
                                <button
                                    className={styles.btnJoin}
                                    onClick={() => {
                                        joinRoomHandler(room)
                                    }}
                                >Подключиться к комнате</button>
                            </li>
                        ))
                    }
                </ul>

                {
                    checkAccess() &&
                    <button
                        className={styles.btnCreate}
                        onClick={createRoomHandler}
                    >Начать трансляцию</button>
                }
            </div>
        </>
    )
}

export default memo(RoomView);
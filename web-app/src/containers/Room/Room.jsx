import { useEffect, useState, memo } from 'react';
import { useParams, useLocation } from 'react-router';
import styles from './Room.module.scss';
import useWebRTC, { LOCAL_VIDEO } from 'src/hooks/useWebRTC';
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Chat from 'src/components/MessengerPage/Chat';
import socket, { SocketConnection } from 'src/socket';
import ChatGroup from 'src/components/MessengerPage/ChatGroup';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux.hook';
import ACTIONS from 'src/constants/actions';
import messageQueueAction from 'src/store/actions/MessageQueueAction';
import { Button } from '@mui/material';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import AddToken from 'src/components/MessengerPage/AddToken';
import BloggerService from 'src/components/Room/BloggerService';
import { ICurrentServiceModel } from 'src/models/blogger/IServiceModel';
import RequestService from 'src/components/Room/RequestService';

function layout(clientsNumber = 1) {
    const pairs = Array.from({ length: clientsNumber })
        .reduce((acc, next, index, arr) => {
            if (index % 2 === 0) {
                acc.push(arr.slice(index, index + 2));
            }

            return acc;
        }, []);

    const rowsNumber = pairs.length;
    const height = `${100 / rowsNumber}%`;

    return pairs.map((row, index, arr) => {

        if (index === arr.length - 1 && row.length === 1) {
            return [{
                width: '100%',
                height,
            }];
        }

        return row.map(() => ({
            width: '50%',
            height,
        }));
    }).flat();
}

const Room = () => {
    const authSelector = useAppSelector((selector) => selector.authReducer);
    const { id: roomID } = useParams();
    const [data, setData] = useState(null);
    const [requestServices, setRequestServices] = useState([]);
    const { clients, provideMediaRef } = useWebRTC(roomID, (data) ? data.is_blogger : false);
    const videoLayout = layout(clients.length);
    const [currentChat, setCurrentChat] = useState(null);
    const dispatch = useAppDispatch();
    const [openPay, setOpenPay] = useState(false);
    const [value, setValue] = useState("1");
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (socket.disconnected) {
            SocketConnection();
        }
    }, [socket.disconnected]);

    useEffect(() => {
        socket.emit("set_authorization_data", {
            access_token: authSelector.access_token,
        });

        socket.on("authorization_success", () => {
            socket.emit("get_conference_info", { rooms_uuid: roomID });
            socket.on("get_conference_info_success", ({ room }) => {
                setData({
                    nickname: room.nickname,
                    link: room.link,
                    is_blogger: room.is_blogger,
                    services: room.services
                });
            });

            socket.on("room_connection_success", () => {
                socket.emit("restart_capture", { rooms_uuid: roomID });
                socket.emit("get_messages_group", { rooms_uuid: roomID });
                socket.on("get_messages_group_result", (data) => {
                    setCurrentChat(data);
                });
            });
        })
    }, []);

    useEffect(() => {
        if (currentChat) {
            socket.on("new_message", (data) => {
                const message = {
                    ...data,
                    updated_at: data.created_at,
                };

                setCurrentChat({
                    ...currentChat,
                    messages: currentChat.messages.concat(message),
                });
            });
        }
    }, [currentChat])

    useEffect(() => {
        socket.removeListener("error");
        socket.on("error", ({ message }) => {
            dispatch(messageQueueAction.addMessage(null, "error", message));
        });
    }, []);

    useEffect(() => {
        socket.removeListener("new_request_service");
        socket.on("new_request_service", (data) => {
            const clone = Array.from(JSON.parse(JSON.stringify(requestServices)));
            clone.push(data);
            console.log(clone);
            setRequestServices(clone);
        });
    }, [data]);

    const addTokenAction = (tokens, cb) => {
        socket.emit("transfer_token", {
            rooms_uuid: roomID,
            tokens: tokens
        });
        cb();
    }

    return (
        <>
            <div
                className={styles.container}
            >
                <div className={styles.videoContainer}>
                    {/*clients.map((clientID, index) => {
                    return (
                        <div key={clientID} style={videoLayout[index]} id={clientID}>
                            <video
                                className={styles.videoElement}
                                ref={instance => {
                                    provideMediaRef(clientID, instance);
                                }}
                                autoPlay
                                playsInline
                                muted={clientID === LOCAL_VIDEO}
                                controls
                            />
                        </div>
                    );
                })*/}
                    {
                        clients.length > 0 &&
                        <div key={clients[clients.length - 1]} style={videoLayout[clients.length - 1]} id={clients[clients.length - 1]}>
                            <video
                                className={styles.videoElement}
                                ref={instance => {
                                    provideMediaRef(clients[clients.length - 1], instance);
                                }}
                                autoPlay={true}
                                playsInline
                                muted={clients[clients.length - 1] === LOCAL_VIDEO}
                                controls
                            />
                        </div>
                    }
                    {
                        data && !data.is_blogger && data.services.length > 0 &&
                        <div>
                            <BloggerService services={data.services} rooms_uuid={data.link} />
                        </div>
                    }
                    <div className={styles.requestList}>
                        {
                            data && data.is_blogger &&
                            requestServices.map((item) =>
                                <RequestService
                                    services={data.services}
                                    nickname={item.nickname}
                                    services_id={item.services_id}
                                    users_id={item.users_id}
                                />)
                        }
                    </div>
                </div>
                <div className={styles.chatContainer}>
                    <div className={styles.chatDescription}>
                        {
                            data && <h4>Трансляцию ведёт: {data.nickname}</h4>
                        }
                        {
                            data && !data.is_blogger &&
                            <Button
                                sx={{
                                    width: "auto",
                                    height: "50px !important"
                                }}
                                variant="contained"
                                endIcon={<MonetizationOn />}
                                onClick={() => {
                                    setOpenPay(true);
                                }}
                            >
                                Подарить токены
                            </Button>
                        }
                    </div>
                    <div>
                        <ChatGroup chat={currentChat} />
                    </div>
                </div>
            </div>
            <AddToken open={openPay} setOpen={setOpenPay} action={addTokenAction} />
        </>
    );
}

export default memo(Room);
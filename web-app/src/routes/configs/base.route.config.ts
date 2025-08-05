import IRouteModel from "src/models/IRouteModel";
import Main from "src/containers/Main";
import BaseItemView from "src/components/Main/BaseItemView/BaseItemView";
import Profile from "src/containers/Profile/Profile";
import Archive from "src/containers/Archive/Archive";
import Conference from "src/containers/Conference/Conference";
import SignInPage from "src/containers/Auth/SignInPage/SignInPage";
import SignUpPage from "src/containers/Auth/SignUpPage/SignUpPage";
import MessengerPage from "src/containers/MessengerPage/MessengerPage";
import Room from "src/containers/Room";
import RoomView from "src/containers/RoomView/RoomView";

const baseRouteConfig: IRouteModel[] = [
    {
        // URL: /
        path: '/',
        element: Main
    },
    {
        // URL: /
        path: '/profile',
        element: Profile
    },
    {
        // URL: /archive,
        path: '/archive',
        element: Archive
    },
    {
        // URL: /conference
        path: '/conference',
        element: Conference
    },
    {
        // URL: /messenger
        path: '/messenger',
        element: MessengerPage
    },
    {
        // URL: /room/:id
        path: '/room/:id',
        element: Room
    },
    {
        // URL: /room-view
        path: '/room-view',
        element: RoomView
    }
];

export default baseRouteConfig;
import IRouteModel from "src/models/IRouteModel";
import UserInfo from "src/components/AdminPage/UserInfo";

const adminRouteConfig: IRouteModel[] = [
    {
        // URL: /admin/user/:id
        path: '/admin/user/:id',
        element: UserInfo
    }
];

export default adminRouteConfig;
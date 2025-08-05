import IRouteModel from "src/models/IRouteModel";
import BloggerPage from "src/containers/BloggerPage/BloggerPage";
import AdminPage from "src/containers/AdminPage/AdminPage";

const funcRouteConfig: IRouteModel[] = [
    {
        // URL: /blogger
        path: '/blogger',
        element: BloggerPage
    },
    {
        // URL: /archive,
        path: '/admin',
        element: AdminPage
    }
];

export default funcRouteConfig;
import IRouteModel from "src/models/IRouteModel";
import SignInPage from "src/containers/Auth/SignInPage/SignInPage";
import SignUpPage from "src/containers/Auth/SignUpPage/SignUpPage";

const authRouteConfig: IRouteModel[] = [
    {
        // URL: /auth/sign-in
        path: '/auth/sign-in',
        element: SignInPage
    },
    {
        // URL: /auth/sign-up
        path: '/auth/sign-up',
        element: SignUpPage
    }
];

export default authRouteConfig;
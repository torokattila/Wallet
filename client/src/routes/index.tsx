import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import Loadable from '../components/Loadable/Loadable';

export default function Router(): React.ReactElement | null {
    return useRoutes([
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '/register',
            element: <Registration />,
        },
        {
            path: '',
            element: <HomePage />,
            children: [
                {
                    path: 'profile',
                    element: <UserProfile />,
                },
            ],
        },
    ]);
}

const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Registration = Loadable(
    lazy(() => import('../pages/authentication/Registration'))
);
const UserProfile = Loadable(lazy(() => import('../pages/UserProfile')));
const HomePage = Loadable(lazy(() => import('../pages/HomePage')));

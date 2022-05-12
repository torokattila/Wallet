import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import Loadable from '../components/Loadable/Loadable';
import AuthGuard from '../guards/AuthGuard';

export default function Router(): React.ReactElement | null {
    return useRoutes([
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '/register',
            element: <Login />,
        },
        {
            path: '',
            element: (
                <AuthGuard>
                    <Home />
                </AuthGuard>
            ),
        },
        {
            path: '/profile',
            element: (
                <AuthGuard>
                    <Profile />
                </AuthGuard>
            ),
        },
        {
            path: '/incomes',
            element: (
                <AuthGuard>
                    <Incomes />
                </AuthGuard>
            ),
        },
        {
            path: '/purchases',
            element: (
                <AuthGuard>
                    <Purchases />
                </AuthGuard>
            ),
        },
    ]);
}

const Login = Loadable(
    lazy(() => import('../pages/authentication/Login/Login'))
);
const Profile = Loadable(lazy(() => import('../pages/Profile/Profile')));
const Home = Loadable(lazy(() => import('../pages/Home/Home')));
const Incomes = Loadable(lazy(() => import('../pages/Incomes/Incomes')));
const Purchases = Loadable(lazy(() => import('../pages/Purchases/Purchases')));

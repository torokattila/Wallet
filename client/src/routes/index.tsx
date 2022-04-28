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
            // children: [
            //     {
            //         path: 'profile',
            //         element: <Profile />
            //     }
            // ]
        },
    ]);
}

const Login = Loadable(lazy(() => import('../pages/authentication/Login/Login')));
// const UserProfile = Loadable(lazy(() => import('../pages/Profile')));
const Home = Loadable(lazy(() => import('../pages/Home/Home')));

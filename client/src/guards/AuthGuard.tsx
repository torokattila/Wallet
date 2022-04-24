import { useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LocalStorageManager from '../utils/LocalStorageManager';

type AuthGuardProps = {
    children: ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const currentUser = LocalStorageManager.getUser();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        } else {
            setIsLoading(false);
        }
    }, []);

    return <>{!isLoading && children}</>;
};

export default AuthGuard;

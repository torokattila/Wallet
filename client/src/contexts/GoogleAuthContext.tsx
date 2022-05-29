import GoogleLogin, {
    GoogleLoginProps,
    GoogleLoginResponseOffline,
    useGoogleLogin,
    UseGoogleLoginResponse,
} from 'react-google-login';
import LoginContainer from '../containers/Login/LoginContainer';
import { createContext, useContext, ReactNode } from 'react';
import { useSnackbar } from 'notistack';
import useLocales from '../hooks/useLocale';

const GoogleAuthContext = createContext<UseGoogleLoginResponse | null>(null);

type GoogleProviderProps = {
    children: ReactNode;
};

export const GoogleAuthProvider = (props: GoogleProviderProps): JSX.Element => {
    const { translate } = useLocales();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { handleGoogleLogin, isGoogleLoginFailed } = LoginContainer();

    const googleAuth = useGoogleLogin({
        clientId: process.env.REACT_APP_CLIENT_ID as string,
        onSuccess: handleGoogleLogin,
        onFailure: (response: GoogleLoginResponseOffline) => {
            if (isGoogleLoginFailed) {
                const key = enqueueSnackbar(
                    translate('general.login.login_failed'),
                    {
                        variant: 'error',
                        onClick: () => {
                            closeSnackbar(key);
                        },
                    }
                );
            }
        },
    });

    return (
        <GoogleAuthContext.Provider value={googleAuth}>
            {props.children}
        </GoogleAuthContext.Provider>
    );
};

export const useGoogleAuth = () => useContext(GoogleAuthContext);

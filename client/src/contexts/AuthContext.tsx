import { createContext, ReactNode, useEffect, useReducer } from 'react';
import {
    ActionMap,
    AuthContextType,
    AuthState,
} from '../@types/authentication';
import User from '../models/User';
import useApi from '../hooks/useApi';
import AuthTypes from '../enums/AuthTypes';

type AuthPayload = {
    [AuthTypes.Initial]: {
        isAuthenticated: boolean;
        user: User | null;
    };
    [AuthTypes.Authorize]: undefined;
    [AuthTypes.Logout]: undefined;
};

export type Actions = ActionMap<AuthPayload>[keyof ActionMap<AuthPayload>];

const initialState: AuthState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const AuthReducer = (state: AuthState, action: Actions) => {
    switch (action.type) {
        case 'INITIALIZE':
            return {
                isAuthenticated: action.payload.isAuthenticated,
                isInitialized: true,
                user: action.payload.user,
            };
        case 'AUTHORIZE':
            return {
                ...state,
                isAuthenticated: true,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
        default:
            return state;
    }
};

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [state, dispatch] = useReducer(AuthReducer, initialState);
    const api = useApi();

    useEffect(() => {
        const initialize = async () => {
            try {
                const accessToken = window.localStorage.getItem('access_token');

                if (accessToken) {
                    const me = await api.getCurrentUser();
                    window.localStorage.setItem('user', JSON.stringify(me));

                    dispatch({
                        type: AuthTypes.Initial,
                        payload: {
                            isAuthenticated: true,
                            user: me,
                        },
                    });
                } else {
                    dispatch({
                        type: AuthTypes.Initial,
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    });
                }
            } catch (error) {
                console.log(error);
                dispatch({
                    type: AuthTypes.Initial,
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        };

        initialize();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                dispatch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };

import React, { ReactNode, createContext } from 'react';
import ApiClient from '../api/ApiClient';

const apiClient = new ApiClient();

const ApiContext = createContext<ApiClient>(apiClient);

type ApiProviderProps = {
    children?: ReactNode;
};

const ApiProvider = (props: ApiProviderProps): JSX.Element => {
    return (
        <ApiContext.Provider value={apiClient}>
            {props.children}
        </ApiContext.Provider>
    );
};

export { ApiContext as default, ApiProvider };

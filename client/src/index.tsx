import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './locales/i18n';
import { SnackbarProvider } from 'notistack';
import 'moment/locale/hu';
import { GoogleAuthProvider } from './contexts/GoogleAuthContext';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18n}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <BrowserRouter>
                    <AuthProvider>
                        <SnackbarProvider
                            maxSnack={1}
                            dense
                            preventDuplicate
                            autoHideDuration={3000}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <GoogleAuthProvider>
                                <App />
                            </GoogleAuthProvider>
                        </SnackbarProvider>
                    </AuthProvider>
                </BrowserRouter>
            </LocalizationProvider>
        </I18nextProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

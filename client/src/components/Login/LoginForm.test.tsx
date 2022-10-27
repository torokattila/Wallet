import { render, screen } from '@testing-library/react';
import LoginForm from './LoginForm';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../locales/i18n';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';

jest.mock('gapi-script', () => {
    return {
        auth2: {
            init: jest.fn(),
        },
    };
});

jest.mock('react-google-login', () => {
    return {
        useGoogleLogin: jest.fn(),
        signIn: jest.fn(),
    }
})

const renderLoginForm = () => {
    render(
        <I18nextProvider i18n={i18n}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <BrowserRouter>
                    <LoginForm />
                </BrowserRouter>
            </LocalizationProvider>
        </I18nextProvider>
    );
};

describe('LoginForm component', () => {
    test('should render without crashing', () => {
        renderLoginForm();
    });
});

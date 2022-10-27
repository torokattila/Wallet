import { render, screen } from '@testing-library/react';
import Login from './Login';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../locales/i18n';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';

jest.mock('gapi-script', () => {
    return {
        auth2: {
            init: jest.fn(),
        },
    };
});

const renderLoginComponent = () => {
    render(
        <I18nextProvider i18n={i18n}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </LocalizationProvider>
        </I18nextProvider>
    );
};

describe('Login Component', () => {
    test('should render without crashing', () => {
        renderLoginComponent();
    });

    test('email input should be empty', () => {
        renderLoginComponent();

        const loginCardTitle = screen.getByTestId('login-card-title');

        console.log(loginCardTitle);
    });
});

import { styled } from '@mui/material/styles';
import { Box, Container, Stack, Typography } from '@mui/material';
import LanguagePopover from '../../../layouts/LanguagePopover';
import LoginForm from '../../../components/Login/LoginForm';
import RegistrationForm from '../../../components/Registration/RegistrationForm';

import useLocales from '../../../hooks/useLocale';
import { useLocation } from 'react-router-dom';

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 650,
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
}));

const Login = (): JSX.Element => {
    const location = useLocation();
    const { onChangeLang, translate, currentLang, allLang } = useLocales();
    const handleLanguageChange = (value: string) => {
        onChangeLang(value);
    };

    return (
        <div>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    pr: 5,
                    py: 2,
                }}
            >
                <Box>
                    <LanguagePopover
                        allLang={allLang}
                        translate={translate}
                        currentLang={currentLang}
                        onChangeLang={handleLanguageChange}
                    />
                </Box>
            </Box>

            <Container maxWidth="lg">
                <Container maxWidth="md">
                    <ContentStyle>
                        <Stack direction="row" justifyContent="center">
                            <img
                                src="/wallet.png"
                                alt="wallet_logo"
                                style={{ maxWidth: '140px', maxHeight: 'auto' }}
                            />
                        </Stack>
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            sx={{ mb: 4 }}
                        >
                            <Typography
                                sx={{ fontWeight: 'bold' }}
                                color="#3F087A"
                                variant="h4"
                            >
                                Wallet.
                            </Typography>
                        </Stack>
                        {location.pathname === '/login' ? (
                            <LoginForm />
                        ) : location.pathname === '/register' ? (
                            <RegistrationForm />
                        ) : null}
                    </ContentStyle>
                </Container>
            </Container>
        </div>
    );
};

export default Login;

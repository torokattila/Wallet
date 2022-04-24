import { styled } from '@mui/material/styles';
import { Box, Container, Stack } from '@mui/material';
import LanguagePopover from '../../layouts/LanguagePopover';
import useLocales from '../../hooks/useLocale';

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
}));

const Login = (): JSX.Element => {
    const { onChangeLang, translate, currentLang, allLang } = useLocales();
    const handleLanguageChange = (value: string) => {
        onChangeLang(value);
    };

    return (
        <>
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

            <Container maxWidth="md">
                <Container maxWidth="sm">
                    <ContentStyle>
                        <Stack
                            direction="row"
                            justifyContent="center"
                            sx={{ mb: 5 }}
                        >
                            <img
                                src="/wallet.png"
                                alt="wallet_logo"
                                style={{ maxWidth: '15vw', maxHeight: 'auto' }}
                            />
                        </Stack>
                        <div>Login</div>
                    </ContentStyle>
                </Container>
            </Container>
        </>
    );
};

export default Login;

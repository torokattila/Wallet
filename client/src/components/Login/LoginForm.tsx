import { Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const LoginForm = (): JSX.Element => {
    return (
        <Stack>
            <Card sx={{ p: 5, mb: 5, borderRadius: 3 }}>
                <Typography
                    color="secondary"
                    sx={{ mb: 5, fontWeight: 'bold' }}
                    align="center"
                    variant="h5"
                >
                    Bejelentkezés
                </Typography>
                <Stack spacing={3}>
                    <TextField
                        color="secondary"
                        fullWidth
                        type="email"
                        label="E-mail cím"
                    />
                    <TextField
                        color="secondary"
                        fullWidth
                        type="password"
                        label="Jelszó"
                    />
                </Stack>

                <Stack sx={{ pt: 8 }} spacing={3}>
                    <Button
                        sx={{ fontWeight: 'bold', p: 2, borderRadius: '8px' }}
                        color="secondary"
                        variant="contained"
                    >
                        Bejelentkezés
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ fontWeight: 'bold', p: 2, borderRadius: '8px' }}
                    >
                        <GoogleIcon sx={{ mr: 2, color: 'secondary' }} />
                        <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 'bold' }}
                        >
                            Belépés Google fiókkal
                        </Typography>
                    </Button>
                </Stack>

                <Stack sx={{ pt: 5 }} alignItems="flex-end" spacing={2}>
                    <Typography color="secondary" variant="subtitle1">
                        Nincs még fiókod?
                    </Typography>
                    <Button
                        color="secondary"
                        sx={{ fontWeight: 'bold' }}
                        variant="outlined"
                    >
                        Regisztráció
                    </Button>
                </Stack>
            </Card>
        </Stack>
    );
};

export default LoginForm;

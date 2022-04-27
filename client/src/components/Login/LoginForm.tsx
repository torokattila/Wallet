import { Button, Card, Stack, TextField, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import useLocales from '../../hooks/useLocale';

const LoginForm = (): JSX.Element => {
    const { translate } = useLocales();
    const navigate = useNavigate();

    return (
        <Stack>
            <Card sx={{ p: 5, mb: 5, borderRadius: 3 }}>
                <Typography
                    color="secondary"
                    sx={{ mb: 5, fontWeight: 'bold' }}
                    align="center"
                    variant="h5"
                >
                    {translate('general.login.login')}
                </Typography>
                <Stack spacing={3}>
                    <TextField
                        color="secondary"
                        fullWidth
                        type="email"
                        label={translate('general.form.email')}
                    />
                    <TextField
                        color="secondary"
                        fullWidth
                        type="password"
                        label={translate('general.form.password')}
                    />
                </Stack>

                <Stack sx={{ pt: 8 }} spacing={3}>
                    <Button
                        sx={{ fontWeight: 'bold', p: 2, borderRadius: '8px' }}
                        color="secondary"
                        variant="contained"
                    >
                        {translate('general.login.login')}
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
                            {translate('general.login.login_google')}
                        </Typography>
                    </Button>
                </Stack>

                <Stack sx={{ pt: 5 }} alignItems="flex-end" spacing={2}>
                    <Typography color="secondary" variant="subtitle1">
                        {translate('general.login.dont_have_account')}
                    </Typography>
                    <Button
                        color="secondary"
                        sx={{ fontWeight: 'bold' }}
                        variant="outlined"
                        onClick={() => navigate('/register')}
                    >
                        {translate('general.login.registration')}
                    </Button>
                </Stack>
            </Card>
        </Stack>
    );
};

export default LoginForm;

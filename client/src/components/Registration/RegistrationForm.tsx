import { Button, Card, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useLocales from '../../hooks/useLocale';

const RegistrationForm = (): JSX.Element => {
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
                    {translate('general.login.registration')}
                </Typography>
                <Stack spacing={3}>
                    <TextField
                        color="secondary"
                        fullWidth
                        type="text"
                        label={translate('general.form.lastname')}
                    />
                    <TextField
                        color="secondary"
                        fullWidth
                        type="text"
                        label={translate('general.form.firstname')}
                    />
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
                    <TextField
                        color="secondary"
                        fullWidth
                        type="password"
                        label={translate('general.form.password_confirm')}
                    />
                </Stack>

                <Stack sx={{ pt: 8 }} spacing={3}>
                    <Button
                        sx={{ fontWeight: 'bold', p: 2, borderRadius: '8px' }}
                        color="secondary"
                        variant="contained"
                    >
                        {translate('general.login.registration')}
                    </Button>
                </Stack>

                <Stack sx={{ pt: 5 }} alignItems="flex-end" spacing={2}>
                    <Typography color="secondary" variant="subtitle1">
                        {translate('general.login.have_account')}
                    </Typography>
                    <Button
                        color="secondary"
                        sx={{ fontWeight: 'bold' }}
                        variant="outlined"
                        onClick={() => navigate('/login')}
                    >
                        {translate('general.login.login')}
                    </Button>
                </Stack>
            </Card>
        </Stack>
    );
};

export default RegistrationForm;

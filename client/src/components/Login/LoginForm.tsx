import {
    Button,
    Card,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import useLocales from '../../hooks/useLocale';
import LoginContainer from '../../containers/Login/LoginContainer';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';

const LoginForm = (): JSX.Element => {
    const { translate } = useLocales();
    const navigate = useNavigate();
    // @ts-ignore
    const { signIn } = useGoogleAuth();

    const {
        email,
        setEmail,
        password,
        setPassword,
        isPassword,
        setIsPassword,
        handleSubmit,
        errors,
    } = LoginContainer();

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <Stack>
                <Card
                    sx={{
                        p: 5,
                        mb: 5,
                        borderRadius: 3,
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Typography
                        color="secondary"
                        sx={{ mb: 5, fontWeight: 'bold' }}
                        align="center"
                        variant="h5"
                        data-testId="login-card-title"
                    >
                        {translate('general.login.login')}
                    </Typography>
                    <Stack spacing={3}>
                        <TextField
                            color="secondary"
                            fullWidth
                            type="email"
                            label={translate('general.form.email')}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            error={errors.email !== undefined}
                            helperText={
                                errors.email
                                    ? translate('general.form.email_required')
                                    : ''
                            }
                        />
                        <TextField
                            color="secondary"
                            fullWidth
                            type={isPassword ? 'password' : 'text'}
                            label={translate('general.form.password')}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            error={errors.password !== undefined}
                            helperText={
                                errors.password
                                    ? translate(
                                          'general.form.password_required'
                                      )
                                    : ''
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setIsPassword(!isPassword)
                                            }
                                            edge="end"
                                        >
                                            <Icon
                                                icon={
                                                    isPassword
                                                        ? eyeFill
                                                        : eyeOffFill
                                                }
                                            />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>

                    <Stack sx={{ pt: 8 }} spacing={3}>
                        <Button
                            sx={{
                                fontWeight: 'bold',
                                p: 2,
                                borderRadius: '8px',
                            }}
                            color="secondary"
                            variant="contained"
                            type="submit"
                        >
                            {translate('general.login.login')}
                        </Button>

                        <Button
                            variant="outlined"
                            color="secondary"
                            sx={{
                                fontWeight: 'bold',
                                p: 2,
                                borderRadius: '8px',
                            }}
                            onClick={signIn}
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
        </form>
    );
};

export default LoginForm;

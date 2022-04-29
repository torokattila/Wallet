import {
    Button,
    Card,
    Stack,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import RegistrationContainer from '../../containers/Registration/RegistrationContainer';
import useLocales from '../../hooks/useLocale';

const RegistrationForm = (): JSX.Element => {
    const { translate } = useLocales();
    const navigate = useNavigate();
    const {
        firstname,
        setFirstame,
        lastname,
        setLastame,
        email,
        setEmail,
        password,
        setPassword,
        passwordConfirm,
        setPasswordConfirm,
        isPassword,
        setIsPassword,
        isPasswordConfirm,
        setIsPasswordConfirm,
        handleSubmit,
        errors,
    } = RegistrationContainer();

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
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
                            value={lastname}
                            onChange={(e) => setLastame(e.target.value)}
                            error={errors.lastname !== undefined}
                            helperText={
                                errors.lastname
                                    ? translate(
                                          'general.form.lastname_required'
                                      )
                                    : ''
                            }
                        />
                        <TextField
                            color="secondary"
                            fullWidth
                            type="text"
                            label={translate('general.form.firstname')}
                            value={firstname}
                            onChange={(e) => setFirstame(e.target.value)}
                            error={errors.firstname !== undefined}
                            helperText={
                                errors.firstname
                                    ? translate(
                                          'general.form.firstname_required'
                                      )
                                    : ''
                            }
                        />
                        <TextField
                            color="secondary"
                            fullWidth
                            type="email"
                            label={translate('general.form.email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        <TextField
                            color="secondary"
                            fullWidth
                            type={isPasswordConfirm ? 'password' : 'text'}
                            label={translate('general.form.password_confirm')}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            error={errors.passwordConfirm !== undefined}
                            helperText={errors.passwordConfirm}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setIsPasswordConfirm(
                                                    !isPasswordConfirm
                                                )
                                            }
                                            edge="end"
                                        >
                                            <Icon
                                                icon={
                                                    isPasswordConfirm
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
        </form>
    );
};

export default RegistrationForm;

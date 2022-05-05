import { Icon } from '@iconify/react';
import {
    Button,
    Card,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
} from '@mui/material';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useTheme } from '@mui/material/styles';
import useLocales from '../../hooks/useLocale';
import ProfileContainer from '../../containers/Profile/ProfileContainer';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';

const PasswordChangeForm = (): JSX.Element => {
    const { translate } = useLocales();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const {
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        newPasswordConfirm,
        setNewPasswordConfirm,
        isCurrentPassword,
        setIsCurrentPassword,
        isNewPassword,
        setIsNewPassword,
        isNewPasswordConfirm,
        setIsNewPasswordConfirm,
        passwordChangeErrors,
        handlePasswordChangeSubmit,
        handleOpenDialog,
        openDialog,
        handleCloseDialog,
    } = ProfileContainer();
    return (
        <>
            <Card
                sx={{
                    p: 4,
                    width: matches ? '60%' : '100%',
                }}
            >
                <Typography
                    variant="h5"
                    color="secondary"
                    sx={{ fontWeight: 'bold' }}
                >
                    {translate('general.profile_page.change_password')}
                </Typography>

                <Stack
                    sx={{ maxWidth: matches ? '50%' : '100%', mt: 10 }}
                    spacing={3}
                >
                    <TextField
                        color="secondary"
                        type={isCurrentPassword ? 'password' : 'text'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        label={translate(
                            'general.profile_page.current_password'
                        )}
                        error={
                            passwordChangeErrors.currentPassword !== undefined
                        }
                        helperText={passwordChangeErrors.currentPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setIsCurrentPassword(
                                                !isCurrentPassword
                                            )
                                        }
                                        edge="end"
                                    >
                                        <Icon
                                            icon={
                                                isCurrentPassword
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
                        type={isNewPassword ? 'password' : 'text'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        label={translate('general.profile_page.new_password')}
                        error={passwordChangeErrors.newPassword !== undefined}
                        helperText={passwordChangeErrors.newPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setIsNewPassword(!isNewPassword)
                                        }
                                        edge="end"
                                    >
                                        <Icon
                                            icon={
                                                isNewPassword
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
                        type={isNewPasswordConfirm ? 'password' : 'text'}
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        label={translate(
                            'general.profile_page.new_password_confirm'
                        )}
                        error={
                            passwordChangeErrors.newPasswordConfirm !==
                            undefined
                        }
                        helperText={passwordChangeErrors.newPasswordConfirm}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setIsNewPasswordConfirm(
                                                !isNewPasswordConfirm
                                            )
                                        }
                                        edge="end"
                                    >
                                        <Icon
                                            icon={
                                                isNewPasswordConfirm
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
                <Stack alignItems="flex-end">
                    <Button
                        size="large"
                        sx={{
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            mt: 4,
                        }}
                        color="secondary"
                        variant="contained"
                        onClick={handleOpenDialog}
                    >
                        {translate('general.profile_page.edit')}
                    </Button>
                </Stack>
            </Card>
            <ConfirmDialog
                open={openDialog}
                onClose={handleCloseDialog}
                executeAction={handlePasswordChangeSubmit}
            />
        </>
    );
};

export default PasswordChangeForm;

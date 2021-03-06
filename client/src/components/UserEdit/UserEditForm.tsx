import {
    Box,
    Button,
    Card,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
} from '@mui/material';

import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';

import ProfileContainer from '../../containers/Profile/ProfileContainer';
import useLocales from '../../hooks/useLocale';
import { useTheme } from '@mui/material/styles';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';

import { motion } from 'framer-motion';

const UserEditForm = (): JSX.Element => {
    const { translate } = useLocales();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    const {
        user,
        email,
        setEmail,
        firstname,
        setFirstname,
        lastname,
        setLastname,
        baseDataErrors,
        openDialog,
        handleOpenDialog,
        handleCloseDialog,
        handleUpdateUser,
    } = ProfileContainer();

    return (
        <>
            <Card
                sx={{
                    p: 4,
                    width: matches ? '60%' : '100%',
                    borderRadius: '15px',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                }}
                component={motion.div}
                initial={{
                    opacity: 0,
                    x: '-100vw',
                }}
                animate={{
                    x: 0,
                    opacity: 1,
                    transition: {
                        type: 'spring',
                        bounce: 0.1,
                        duration: 1.5,
                    },
                }}
            >
                <Box
                    sx={{ display: 'flex' }}
                    flexDirection="row"
                    justifyContent="space-between"
                >
                    <Box>
                        <Typography
                            variant="h5"
                            color="secondary"
                            sx={{ fontWeight: 'bold' }}
                        >
                            {translate('general.profile_page.change_data')}
                        </Typography>
                    </Box>
                    <Box>
                        <NoteAltOutlinedIcon
                            fontSize="large"
                            color="secondary"
                        />
                    </Box>
                </Box>

                <Stack
                    sx={{ maxWidth: matches ? '50%' : '100%', mt: 10 }}
                    spacing={3}
                >
                    <TextField
                        color="secondary"
                        type="email"
                        disabled={user?.googleId ? true : false}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label={translate('general.form.email')}
                        error={baseDataErrors.email !== undefined}
                        helperText={baseDataErrors.email}
                    />
                    <TextField
                        color="secondary"
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        label={translate('general.form.lastname')}
                        error={baseDataErrors.lastname !== undefined}
                        helperText={baseDataErrors.lastname}
                    />
                    <TextField
                        color="secondary"
                        type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        label={translate('general.form.firstname')}
                        error={baseDataErrors.firstname !== undefined}
                        helperText={baseDataErrors.firstname}
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
                executeAction={handleUpdateUser}
            />
        </>
    );
};

export default UserEditForm;

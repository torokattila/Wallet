import { Box, Button, Card, Typography, useMediaQuery } from '@mui/material';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';

import useLocales from '../../hooks/useLocale';
import { useTheme } from '@mui/material/styles';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import ProfileContainer from '../../containers/Profile/ProfileContainer';

const UserDeleteForm = (): JSX.Element => {
    const { translate } = useLocales();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    const { openDialog, handleOpenDialog, handleCloseDialog, handleDeleteUser } =
        ProfileContainer();

    return (
        <>
            <Card
                sx={{
                    p: 4,
                    width: matches ? '60%' : '100%',
                    borderRadius: '15px',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
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
                            {translate('general.profile_page.delete_account')}
                        </Typography>
                    </Box>
                    <Box>
                        <PersonRemoveOutlinedIcon
                            fontSize="large"
                            color="secondary"
                        />
                    </Box>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Button
                        size="large"
                        sx={{
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            mt: 4,
                        }}
                        color="error"
                        variant="contained"
                        onClick={handleOpenDialog}
                    >
                        {translate('general.profile_page.delete_account')}
                    </Button>
                </Box>
            </Card>
            <ConfirmDialog
                open={openDialog}
                onClose={handleCloseDialog}
                executeAction={handleDeleteUser}
            />
        </>
    );
};

export default UserDeleteForm;

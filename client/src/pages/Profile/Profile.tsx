import {
    Box,
    Button,
    Card,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import DrawerLayout from '../../components/Drawer/DrawerLayout';
import useLocales from '../../hooks/useLocale';

import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';

const Profile = (): JSX.Element => {
    const { translate } = useLocales();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    return (
        <DrawerLayout>
            <Stack
                className="profile-page-container"
                alignItems="center"
                display="flex"
                justifyContent="center"
                flexDirection="column"
                spacing={10}
                sx={{ margin: 0 }}
            >
                <Card
                    sx={{
                        p: 4,
                        width: matches ? '60%' : '100%',
                    }}
                >
                    <form>
                        <Typography
                            variant="h5"
                            color="secondary"
                            sx={{ fontWeight: 'bold' }}
                        >
                            {translate('general.profile_page.change_data')}
                        </Typography>

                        <Stack
                            sx={{ maxWidth: matches ? '50%' : '100%', mt: 10 }}
                            spacing={3}
                        >
                            <TextField
                                color="secondary"
                                type="email"
                                label={translate('general.form.email')}
                            />
                            <TextField
                                color="secondary"
                                type="email"
                                label={translate('general.form.lastname')}
                            />
                            <TextField
                                color="secondary"
                                type="email"
                                label={translate('general.form.firstname')}
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
                                // type="submit"
                            >
                                {translate('general.profile_page.edit')}
                            </Button>
                        </Stack>
                    </form>
                </Card>

                <Card
                    sx={{
                        p: 4,
                        width: matches ? '60%' : '100%',
                    }}
                >
                    <form>
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
                                type="password"
                                label={translate(
                                    'general.profile_page.current_password'
                                )}
                            />
                            <TextField
                                color="secondary"
                                type="password"
                                label={translate(
                                    'general.profile_page.new_password'
                                )}
                            />
                            <TextField
                                color="secondary"
                                type="password"
                                label={translate(
                                    'general.profile_page.new_password_confirm'
                                )}
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
                                // type="submit"
                            >
                                {translate('general.profile_page.edit')}
                            </Button>
                        </Stack>
                    </form>
                </Card>
            </Stack>
        </DrawerLayout>
    );
};

export default Profile;

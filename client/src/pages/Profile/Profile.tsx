import { Stack } from '@mui/material';
import DrawerLayout from '../../components/Drawer/DrawerLayout';
import PasswordChangeForm from '../../components/PasswordChange/PasswordChangeForm';
import UserEditForm from '../../components/UserEdit/UserEditForm';

const Profile = (): JSX.Element => {
    return (
        <div>
            <DrawerLayout>
                <Stack
                    alignItems="center"
                    display="flex"
                    justifyContent="center"
                    flexDirection="column"
                    spacing={6}
                    sx={{ margin: 0 }}
                >
                    <UserEditForm />
                    <PasswordChangeForm />
                </Stack>
            </DrawerLayout>
        </div>
    );
};

export default Profile;

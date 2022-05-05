import { Stack } from '@mui/material';
import DrawerLayout from '../../components/Drawer/DrawerLayout';
import PasswordChangeForm from '../../components/PasswordChange/PasswordChangeForm';
import UserEditForm from '../../components/UserEdit/UserEditForm';
import './Profile.css';

const Profile = (): JSX.Element => {
    return (
        <div className='profile-container'>
            <DrawerLayout>
                <Stack
                    className="profile-page-container"
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

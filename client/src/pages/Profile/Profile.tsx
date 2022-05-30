import { Stack } from '@mui/material';
import DrawerLayout from '../../components/Drawer/DrawerLayout';
import PasswordChangeForm from '../../components/PasswordChange/PasswordChangeForm';
import UserDeleteForm from '../../components/UserEdit/UserDeleteForm';
import UserEditForm from '../../components/UserEdit/UserEditForm';

import { motion } from 'framer-motion';

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
                    <UserEditForm />
                    <PasswordChangeForm />
                    <UserDeleteForm />
                </Stack>
            </DrawerLayout>
        </div>
    );
};

export default Profile;

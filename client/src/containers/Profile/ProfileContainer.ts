import { useState } from 'react';
import { useSnackbar } from 'notistack';
import useLocales from '../../hooks/useLocale';
import LocalStorageManager from '../../utils/LocalStorageManager';
import useApi from '../../hooks/useApi';
import * as Yup from 'yup';
import UserEditPayload from '../../api/payloads/Profile/UserEditPayload';
import PasswordChangePayload from '../../api/payloads/Profile/PasswordChangePayload';
import { useNavigate } from 'react-router-dom';

const ProfileContainer = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { translate } = useLocales();
    const user = LocalStorageManager.getUser();

    const apiClient = useApi();

    const [email, setEmail] = useState<string>(user?.email ? user.email : '');
    const [firstname, setFirstname] = useState<string>(
        user?.firstname ? user.firstname : ''
    );
    const [lastname, setLastname] = useState<string>(
        user?.lastname ? user.lastname : ''
    );
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');
    const [isCurrentPassword, setIsCurrentPassword] = useState<boolean>(true);
    const [isNewPassword, setIsNewPassword] = useState<boolean>(true);
    const [isNewPasswordConfirm, setIsNewPasswordConfirm] =
        useState<boolean>(true);
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const [baseDataErrors, setBaseDataErrors] = useState<{
        [key: string]: string;
    }>({});
    const [passwordChangeErrors, setPasswordChangeErrors] = useState<{
        [key: string]: string;
    }>({});

    const UserEditSchema = Yup.object().shape({
        firstname: Yup.string().required(
            translate('general.form.firstname_required')
        ),
        lastname: Yup.string().required(
            translate('general.form.lastname_required')
        ),
        email: Yup.string()
            .email(translate('general.form.wrong_email_format'))
            .required('general.form.email_required'),
    });

    const PasswordChangeSchema = Yup.object().shape({
        currentPassword: Yup.string().required(
            translate('general.profile_page.current_password_required')
        ),
        newPassword: Yup.string().required(
            translate('general.profile_page.new_password_required')
        ),
        newPasswordConfirm: Yup.string()
            .required(
                translate('general.profile_page.new_password_confirm_required')
            )
            .oneOf(
                [Yup.ref('newPassword'), null],
                translate('general.form.passwords_do_not_match')
            ),
    });

    const editedUser: UserEditPayload = {
        email,
        firstname,
        lastname,
    };

    const passwordChangeDatas: PasswordChangePayload = {
        currentPassword,
        newPassword,
        newPasswordConfirm,
    };

    const verifyBaseDatasForm = async (): Promise<boolean> => {
        try {
            await UserEditSchema.validate(editedUser, { abortEarly: false });
            setBaseDataErrors({});

            return Promise.resolve(true);
        } catch (error: any) {
            const newErrors: { [key: string]: string } = {};

            for (const err of error.inner) {
                newErrors[err.path] = err.message;
            }

            setBaseDataErrors(newErrors);
            return Promise.resolve(false);
        }
    };

    const verifyPasswordChangeForm = async (): Promise<boolean> => {
        try {
            await PasswordChangeSchema.validate(passwordChangeDatas, {
                abortEarly: false,
            });
            setPasswordChangeErrors({});

            return Promise.resolve(true);
        } catch (error: any) {
            const newErrors: { [key: string]: string } = {};

            for (const err of error.inner) {
                newErrors[err.path] = err.message;
            }

            setPasswordChangeErrors(newErrors);
            return Promise.resolve(false);
        }
    };

    const handlePasswordChangeSubmit = async () => {
        const payload: PasswordChangePayload = {
            currentPassword,
            newPassword,
            newPasswordConfirm,
        };

        const isVerified = await verifyPasswordChangeForm();

        if (isVerified) {
            try {
                await apiClient.updateUserPassword(
                    user?.id ? user.id : '',
                    payload
                );
                const key = enqueueSnackbar(
                    translate(
                        'general.profile_page.password_change_successful'
                    ),
                    {
                        variant: 'success',
                        onClick: () => {
                            closeSnackbar(key);
                        },
                    }
                );
                setCurrentPassword('');
                setNewPassword('');
                setNewPasswordConfirm('');
            } catch (error: any) {
                if (
                    error.response.data.errors[0] === 'invalid_current_password'
                ) {
                    const key = enqueueSnackbar(
                        translate(
                            'general.profile_page.wrong_current_password'
                        ),
                        {
                            variant: 'error',
                            onClick: () => {
                                closeSnackbar(key);
                            },
                        }
                    );
                } else {
                    const key = enqueueSnackbar(
                        translate(
                            'general.profile_page.password_change_failed'
                        ),
                        {
                            variant: 'error',
                            onClick: () => {
                                closeSnackbar(key);
                            },
                        }
                    );
                }
            }
        } else {
            const key = enqueueSnackbar(
                translate('general.profile_page.validation_error'),
                {
                    variant: 'error',
                    onClick: () => {
                        closeSnackbar(key);
                    },
                }
            );
        }
    };

    const handleUpdateUser = async () => {
        const payload: UserEditPayload = {
            email,
            firstname,
            lastname,
        };

        const isVerified = await verifyBaseDatasForm();

        if (isVerified) {
            try {
                await apiClient.updateUser(user?.id ? user.id : '', payload);

                const key = enqueueSnackbar(
                    translate('general.profile_page.successful_modification'),
                    {
                        variant: 'success',
                        onClick: () => {
                            closeSnackbar(key);
                        },
                    }
                );
            } catch (error: any) {
                if (error.response.data.errors[0] === 'existing_email') {
                    const key = enqueueSnackbar(
                        translate('general.form.existing_email'),
                        {
                            variant: 'error',
                            onClick: () => {
                                closeSnackbar(key);
                            },
                        }
                    );
                } else {
                    const key = enqueueSnackbar(
                        translate(
                            'general.profile_page.unsuccessful_modification'
                        ),
                        {
                            variant: 'error',
                            onClick: () => {
                                closeSnackbar(key);
                            },
                        }
                    );
                }
            }
        } else {
            const key = enqueueSnackbar(
                translate('general.profile_page.validation_error'),
                {
                    variant: 'error',
                    onClick: () => {
                        closeSnackbar(key);
                    },
                }
            );
        }
    };

    const handleDeleteUser = async () => {
        try {
            await apiClient.deleteUser(user?.id ? user.id : '');
            await LocalStorageManager.removeLocalStorage();
            navigate('/');
        } catch (error: any) {
            const key = enqueueSnackbar(
                translate(
                    'general.home_page.delete_failed'
                ),
                {
                    variant: 'error',
                    onClick: () => {
                        closeSnackbar(key);
                    },
                }
            );
        }
    }

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return {
        email,
        setEmail,
        firstname,
        setFirstname,
        lastname,
        setLastname,
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
        baseDataErrors,
        passwordChangeErrors,
        handlePasswordChangeSubmit,
        openDialog,
        handleOpenDialog,
        handleCloseDialog,
        handleUpdateUser,
        handleDeleteUser,
    };
};

export default ProfileContainer;

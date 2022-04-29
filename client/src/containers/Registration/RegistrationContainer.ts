import axios, { AxiosError, AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import RegistrationPayload from '../../api/payloads/Registration/RegistrationPayload';
import config from '../../config';
import useLocales from '../../hooks/useLocale';
import LocalStorageManager from '../../utils/LocalStorageManager';

const RegistrationContainer = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { translate } = useLocales();
    const navigate = useNavigate();

    const [firstname, setFirstame] = useState<string>('');
    const [lastname, setLastame] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [isPassword, setIsPassword] = useState<boolean>(true);
    const [isPasswordConfirm, setIsPasswordConfirm] = useState<boolean>(true);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const registerUser = {
        firstname,
        lastname,
        email,
        password,
        passwordConfirm,
    };

    const RegistrationSchema = Yup.object().shape({
        firstname: Yup.string().required(
            `${translate('general.form.firstname_required')}`
        ),
        lastname: Yup.string().required(
            `${translate('general.form.lastname_required')}`
        ),
        email: Yup.string().required(
            `${translate('general.form.email_required')}`
        ),
        password: Yup.string().required(
            `${translate('general.form.password_required')}`
        ),
        passwordConfirm: Yup.string()
            .required(`${translate('general.form.password_confirm_required')}`)
            .oneOf(
                [Yup.ref('password'), null],
                translate('general.form.passwords_do_not_match')
            ),
    });

    const verifyForm = async (): Promise<boolean> => {
        try {
            await RegistrationSchema.validate(registerUser, {
                abortEarly: false,
            });
            setErrors({});

            return Promise.resolve(true);
        } catch (error: any) {
            const newErrors: { [key: string]: string } = {};

            for (const err of error.inner) {
                newErrors[err.path] = err.message;
            }

            setErrors(newErrors);
            return Promise.resolve(false);
        }
    };

    const handleSubmit = async (e: React.SyntheticEvent): Promise<void> => {
        e.preventDefault();

        const payload: RegistrationPayload = {
            firstname,
            lastname,
            email,
            password,
            passwordConfirm,
        };

        const isFormVerified = await verifyForm();

        if (isFormVerified) {
            await axios
                .post(`${config.registrationUrl}`, payload)
                .then((response: AxiosResponse) => {
                    const { user, token } = response.data;

                    LocalStorageManager.setUser(user);
                    LocalStorageManager.setToken(token);
                    navigate('/');
                })
                .catch((error: any) => {
                    if (
                        error.response.data.errors[0] === 'email_already_exists'
                    ) {
                        const key = enqueueSnackbar(
                            translate('general.form.existing_email'),
                            {
                                variant: 'error',
                                onClick: () => {
                                    closeSnackbar(key);
                                },
                            }
                        );
                    }
                });
        }
    };

    return {
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
    };
};

export default RegistrationContainer;

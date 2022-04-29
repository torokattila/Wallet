import axios, { AxiosResponse } from 'axios';
import React, { useState } from 'react';

import * as Yup from 'yup';
import LoginPayload from '../../api/payloads/Login/LoginPayload';
import config from '../../config';
import { useSnackbar } from 'notistack';
import useLocales from '../../hooks/useLocale';
import LocalStorageManager from '../../utils/LocalStorageManager';
import { useNavigate } from 'react-router-dom';

const LoginContainer = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { translate } = useLocales();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isPassword, setIsPassword] = useState<boolean>(true);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const loginUser = {
        email,
        password,
    };

    const LoginSchema = Yup.object().shape({
        email: Yup.string().required(
            `${translate('general.form.email_required')}`
        ),
        password: Yup.string().required(
            `${translate('general.form.password_required')}`
        ),
    });

    const verifyForm = async (): Promise<boolean> => {
        try {
            await LoginSchema.validate(loginUser, { abortEarly: false });
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

        const payload: LoginPayload = {
            email,
            password,
        };

        const isFormVerified = await verifyForm();

        if (isFormVerified) {
            await axios
                .post(`${config.loginUrl}`, payload)
                .then((response: AxiosResponse) => {
                    const { user, token } = response.data;

                    LocalStorageManager.setUser(user);
                    LocalStorageManager.setToken(token);
                    navigate('/');
                })
                .catch((error: any) => {
                    const key = enqueueSnackbar(
                        translate('general.form.wrong_username_or_password'),
                        {
                            variant: 'error',
                            onClick: () => {
                                closeSnackbar(key);
                            },
                        }
                    );
                });
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        isPassword,
        setIsPassword,
        handleSubmit,
        errors,
    };
};

export default LoginContainer;

import { useState } from 'react';

const RegistrationContainer = () => {
    const [firstname, setFirstame] = useState<string>('');
    const [lastname, setLastame] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [isPassword, setIsPassword] = useState<boolean>(true);
    const [isPasswordConfirm, setIsPasswordConfirm] = useState<boolean>(true);

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
    };
};

export default RegistrationContainer;

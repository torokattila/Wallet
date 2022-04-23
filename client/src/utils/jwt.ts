import { sign, verify } from 'jsonwebtoken';

const setSession = (accessToken: string | null) => {
    if (accessToken) {
        localStorage.setItem('access_token', accessToken);
    } else {
        localStorage.removeItem('access_token');
    }
};

export default { setSession, sign, verify };

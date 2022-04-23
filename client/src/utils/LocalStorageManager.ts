import User from '../models/User';

class LocalStorageManager {
    getUser() {
        const raw = localStorage.getItem('user');

        if (raw && raw !== 'undefined') {
            const user = JSON.parse(raw);

            return user as User;
        } else {
            return;
        }
    }

    async setUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
    }
}

export default new LocalStorageManager();

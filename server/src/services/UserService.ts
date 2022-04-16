import User from 'entities/User';
import bcrypt from 'bcrypt';
import { getConnection } from 'typeorm';
import { Logger } from 'common';

const logger = Logger(__filename);

class UserService {
    public async findByEmail(email: string): Promise<User> {
        try {
            const foundUser = await this.gerRepository().findOne({
                where: { email },
            });

            return foundUser;
        } catch (error: any) {
            logger.error('find_by_email_failed_in_UserService');
            throw new Error(error);
        }
    }

    public async save(user: User): Promise<User> {
        try {
            const savedUser = await this.gerRepository().save(user);

            return savedUser;
        } catch (error: any) {
            logger.error('user_save_failed_in_UserService');
            throw new Error(error);
        }
    }

    public generateHash(hashBase: string) {
        return bcrypt.hash(hashBase, 10);
    }

    public verifyPassword(
        password1: string,
        password2: string
    ): Promise<boolean> {
        return bcrypt.compare(password1, password2);
    }

    public validatePasswordMatch(
        password: string,
        passwordConfirm: string
    ): boolean {
        if (!password || password !== passwordConfirm) return false;

        return true;
    }

    private gerRepository() {
        return getConnection().getRepository(User);
    }
}

export default new UserService();

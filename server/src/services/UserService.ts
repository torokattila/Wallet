import User from '../entities/User';
import bcrypt from 'bcrypt';
import { getConnection } from 'typeorm';
import { Logger } from 'common';

const logger = Logger(__filename);

class UserService {
    public async findByEmail(email: string): Promise<User> {
        try {
            const foundUser = await this.getRepository().findOne({
                where: { email },
            });

            return foundUser;
        } catch (error: any) {
            logger.error('find_by_email_failed_in_UserService');
            throw new Error(error);
        }
    }

    public async findById(userId: string): Promise<User> {
        try {
            const queryBuilder =
                this.getRepository().createQueryBuilder('user');
            queryBuilder.leftJoinAndSelect('user.purchases', 'purchases');
            queryBuilder.leftJoinAndSelect('user.incomes', 'incomes');

            queryBuilder.andWhere('user.id = :id', { id: userId });

            const user = await queryBuilder.getOne();
            delete user.password;

            return Promise.resolve(user);
        } catch (error: any) {
            logger.error('Find user by id operation failed in UserService');
            throw new Error('user_not_found');
        }
    }

    public async update(userId: string, user: Partial<User>): Promise<User> {
        try {
            const editedUser = user;
            editedUser.modified = new Date();

            await this.getRepository().update(userId, editedUser);

            const result = await this.findById(userId);

            return result;
        } catch (error: any) {
            console.log(error);
            logger.error('Update operation failed in UserService');
            throw new Error('update_operation_failed_in_UserService');
        }
    }

    public async save(user: User): Promise<User> {
        try {
            const savedUser = await this.getRepository().save(user);

            return savedUser;
        } catch (error: any) {
            logger.error('user_save_failed_in_UserService');
            throw new Error(error);
        }
    }

    public async delete(userId: string): Promise<void> {
        try {
            await this.getRepository().delete(userId);
        } catch (error: any) {
            logger.error('Delete operation failed in UserService');
            throw new Error('delete_operation_failed_in_UserService');
        }
    }

    public async updatePassword(id: string, password: string): Promise<User> {
        try {
            const foundUser = await this.getRepository().findOne({
                where: { id },
            });
            foundUser.password = await this.generateHash(password);
            foundUser.modified = new Date();

            const savedUser = await this.getRepository().save(foundUser);
            delete savedUser.password;

            return savedUser;
        } catch (error: any) {
            logger.error('Update password operation failed in UserService');
            throw new Error('update_password_operation_failed_in_UserService');
        }
    }

    public async comparePassword(
        password1: string,
        password2: string
    ): Promise<boolean> {
        return await bcrypt.compare(password1, password2);
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

    private getRepository() {
        return getConnection().getRepository(User);
    }
}

export default new UserService();

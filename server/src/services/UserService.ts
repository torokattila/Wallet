import User from '../entities/User';
import bcrypt from 'bcrypt';
import { getConnection } from 'typeorm';
import { Logger } from 'common';

const logger = Logger(__filename);
const getUserRepository = () => getConnection().getRepository(User);

const findByEmail = async (email: string): Promise<User> => {
    try {
        const foundUser = await getUserRepository().findOne({
            where: { email },
        });

        return foundUser;
    } catch (error: any) {
        logger.error('find_by_email_failed_in_UserService');
        throw new Error(error);
    }
};

const findById = async (userId: string): Promise<User> => {
    const queryBuilder = getUserRepository().createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.purchases', 'purchases');
    queryBuilder.leftJoinAndSelect('user.incomes', 'incomes');

    queryBuilder.andWhere('user.id = :id', { id: userId });

    const user = await queryBuilder.getOne();
    delete user.password;

    return Promise.resolve(user);
};

const findByGoogleId = async (googleId: string): Promise<User | undefined> => {
    const queryBuilder = getUserRepository().createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.purchases', 'purchases');
    queryBuilder.leftJoinAndSelect('user.incomes', 'incomes');

    queryBuilder.andWhere('user.googleId = :id', { id: googleId });

    const user = await queryBuilder.getOne();

    if (user) {
        delete user.password;
    }

    return Promise.resolve(user);
};

const update = async (userId: string, user: Partial<User>): Promise<User> => {
    try {
        const editedUser = user;
        editedUser.modified = new Date();

        await getUserRepository().update(userId, editedUser);

        const result = await findById(userId);

        return result;
    } catch (error: any) {
        console.log(error);
        logger.error('Update operation failed in UserService');
        throw new Error('update_operation_failed_in_UserService');
    }
};

const save = async (user: User): Promise<User> => {
    try {
        const savedUser = await getUserRepository().save(user);

        return savedUser;
    } catch (error: any) {
        logger.error('user_save_failed_in_UserService');
        throw new Error(error);
    }
};

const remove = async (userId: string): Promise<void> => {
    try {
        await getUserRepository().delete(userId);
    } catch (error: any) {
        console.log(error);
        logger.error('Delete operation failed in UserService');
        throw new Error('delete_operation_failed_in_UserService');
    }
};

const updatePassword = async (id: string, password: string): Promise<User> => {
    try {
        const foundUser = await getUserRepository().findOne({
            where: { id },
        });
        foundUser.password = await generateHash(password);
        foundUser.modified = new Date();

        const savedUser = await getUserRepository().save(foundUser);
        delete savedUser.password;

        return savedUser;
    } catch (error: any) {
        logger.error('Update password operation failed in UserService');
        throw new Error('update_password_operation_failed_in_UserService');
    }
};

const comparePassword = async (
    password1: string,
    password2: string
): Promise<boolean> => {
    return await bcrypt.compare(password1, password2);
};

const generateHash = async (hashBase: string) => {
    return await bcrypt.hash(hashBase, 10);
};

const verifyPassword = async (
    password1: string,
    password2: string
): Promise<boolean> => {
    return await bcrypt.compare(password1, password2);
};

const validatePasswordMatch = (
    password: string,
    passwordConfirm: string
): boolean => {
    if (!password || password !== passwordConfirm) return false;

    return true;
};

export default {
    findByEmail,
    findById,
    update,
    save,
    remove,
    updatePassword,
    comparePassword,
    generateHash,
    verifyPassword,
    validatePasswordMatch,
    findByGoogleId,
};

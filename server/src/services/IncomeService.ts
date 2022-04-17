import { Logger } from 'common';
import config from '../config';
import Income from 'entities/Income';
import { Brackets, getConnection } from 'typeorm';
import PaginationOptions from '../types/PaginationOptions';
import UserService from './UserService';

const logger = Logger(__filename);

export type IncomeFilterOptions = {
    from?: string;
    to?: string;
};

export type IncomeListParamsType = {
    filter?: IncomeFilterOptions;
    pagination?: PaginationOptions;
};

export type IncomeList = [Income[], number];

class IncomeService {
    public async list(
        userId: string,
        params?: IncomeListParamsType
    ): Promise<IncomeList> {
        const defaultParams: IncomeListParamsType = {
            filter: {},
            pagination: {
                page: 1,
                size: config.defaultPageSize,
            },
        };
        const findParams: IncomeListParamsType = {
            filter: { ...defaultParams.filter, ...params.filter },
            pagination: { ...defaultParams.pagination, ...params.pagination },
        };

        try {
            const queryBuilder =
                this.getRepository().createQueryBuilder('income');
            queryBuilder.andWhere('income.userId = :id', { id: userId });

            if (findParams.filter.from) {
                queryBuilder.andWhere(
                    new Brackets((qb) => {
                        qb.where('income.created >= :from', {
                            from: findParams.filter.from,
                        });
                    })
                );

                delete findParams.filter.from;
            }

            if (findParams.filter.to) {
                queryBuilder.andWhere(
                    new Brackets((qb) => {
                        qb.where('income.created <= :to', {
                            to: findParams.filter.to,
                        });
                    })
                );

                delete findParams.filter.to;
            }

            if (findParams?.pagination?.size) {
                queryBuilder.limit(findParams.pagination.size);

                if (findParams?.pagination?.page) {
                    queryBuilder.offset(
                        findParams.pagination.size *
                            (findParams.pagination.page - 1)
                    );
                }
            }

            queryBuilder.orderBy('income.created', 'DESC');

            const [incomes, count] = await queryBuilder.getManyAndCount();

            return Promise.resolve([incomes, count]);
        } catch (error: any) {
            logger.error('List operation failed in IncomeService');
            throw new Error('list_operation_failed_in_IncomeService');
        }
    }

    public async create(income: Partial<Income>): Promise<Income> {
        try {
            const newIncome = income;
            newIncome.userId = income.userId;

            const user = await UserService.findById(newIncome.userId);
            user.balance += newIncome.amount;

            await UserService.save(user);

            const result = this.getRepository().save(newIncome);

            return result;
        } catch (error: any) {
            logger.error('Error to create new income in IncomeService');
            throw new Error('failed_to_create_new_income');
        }
    }

    public async findById(incomeId: string): Promise<Income> {
        try {
            const foundIncome = await this.getRepository().findOne({
                where: { id: incomeId },
            });

            return foundIncome;
        } catch (error: any) {
            logger.error('Error to find income by id in IncomeService');
            throw new Error('failed_to_find_income_by_id');
        }
    }

    public async update(
        incomeId: string,
        income: Partial<Income>
    ): Promise<Income> {
        try {
            const oldIncome = await this.findById(incomeId);
            const incomeUser = await UserService.findById(oldIncome.userId);
            incomeUser.balance -= oldIncome.amount;

            const updatedUser = await UserService.save(incomeUser);

            oldIncome.amount = income.amount;
            oldIncome.modified = new Date();
            const updatedIncome = await this.getRepository().save(oldIncome);

            updatedUser.balance += updatedIncome.amount;
            await UserService.save(updatedUser);

            return updatedIncome;
        } catch (error: any) {
            logger.error('Update operation failed in IncomeService');
            throw new Error('update_operation_failed_in_IncomeService');
        }
    }

    public async remove(incomeId: string): Promise<void> {
        try {
            const oldIncome = await this.findById(incomeId);
            const incomeUser = await UserService.findById(oldIncome.userId);

            incomeUser.balance -= oldIncome.amount;

            await UserService.save(incomeUser);
            await this.getRepository().delete(incomeId);
        } catch (error: any) {
            logger.error('Remove operation failed in IncomeService');
            throw new Error('remove_operation_failed_in_IncomeService');
        }
    }

    private getRepository() {
        return getConnection().getRepository(Income);
    }
}

export default new IncomeService();

import Purchase from '../entities/Purchase';
import { getConnection, Brackets } from 'typeorm';
import { Logger } from 'common';
import UserService from './UserService';
import PaginationOptions from '../types/PaginationOptions';
import config from 'config';

const logger = Logger(__filename);

export type PurchaseFilterOptions = {
    from?: string;
    to?: string;
    category?: string;
};

export type PurchaseListParamsType = {
    filter?: PurchaseFilterOptions;
    pagination?: PaginationOptions;
};

export type PurchaseList = [Purchase[], number];

class PurchaseService {
    public async list(
        userId: string,
        params?: PurchaseListParamsType
    ): Promise<PurchaseList> {
        const defaultParams: PurchaseListParamsType = {
            filter: {},
            pagination: {
                page: 1,
                size: config.defaultPageSize,
            },
        };

        const findParams: PurchaseListParamsType = {
            filter: { ...defaultParams.filter, ...params.filter },
            pagination: { ...defaultParams.pagination, ...params.pagination },
        };

        try {
            const queryBuilder =
                this.getRepository().createQueryBuilder('purchase');
            queryBuilder.andWhere('purchase.userId = :userId', { userId });

            if (findParams.filter.category) {
                queryBuilder.andWhere('purchase.category = :category', {
                    cagetory: findParams.filter.category,
                });

                delete findParams.filter.category;
            }

            if (findParams.filter.from) {
                queryBuilder.andWhere(
                    new Brackets((qb) => {
                        qb.where('purchase.created >= :from', {
                            from: findParams.filter.from,
                        });
                    })
                );

                delete findParams.filter.from;
            }

            if (findParams.filter.to) {
                queryBuilder.andWhere(
                    new Brackets((qb) => {
                        qb.where('purchase.to <= :to', {
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

            queryBuilder.orderBy('purchase.created', 'DESC');

            const [purchases, count] = await queryBuilder.getManyAndCount();

            return Promise.resolve([purchases, count]);
        } catch (error: any) {
            logger.error('List operation failed in PurchaseService');
            throw new Error('list_opetation_failed_in_PurchaseService');
        }
    }

    public async create(purchase: Partial<Purchase>): Promise<Purchase> {
        try {
            const newPurchase = purchase;
            newPurchase.userId = purchase.userId;

            const user = await UserService.findById(newPurchase.userId);

            user.balance -= newPurchase.amount;

            await UserService.save(user);
            const result = this.getRepository().save(newPurchase);

            return result;
        } catch (error: any) {
            logger.error('Error to create new purchase in PurchaseService');
            throw new Error('failed_to_create_new_purchase');
        }
    }

    public async update(
        purchaseId: string,
        purchase: Partial<Purchase>
    ): Promise<Purchase> {
        try {
            const oldPurchase = await this.findById(purchaseId);
            const purchaseUser = await UserService.findById(oldPurchase.userId);
            purchaseUser.balance += oldPurchase.amount;

            const updatedUser = await UserService.save(purchaseUser);

            oldPurchase.amount = purchase.amount;
            oldPurchase.category = purchase.category;
            oldPurchase.modified = new Date();
            oldPurchase.currency = purchase.currency;

            const updatedPurchase = await this.getRepository().save(
                oldPurchase
            );
            updatedUser.balance -= updatedPurchase.amount;

            await UserService.save(updatedUser);

            return updatedPurchase;
        } catch (error: any) {
            logger.error('Update operation failed in PurchaseService');
            throw new Error('update_operation_failed_in_PurchaseService');
        }
    }

    public async findById(purchaseId: string): Promise<Purchase> {
        try {
            const foundPurchase: Purchase = await this.getRepository().findOne({
                where: { id: purchaseId },
            });

            return foundPurchase;
        } catch (error: any) {
            logger.error('Error to find purchase by id in PurchaseService');
            throw new Error('failed_to_find_puchase_by_id');
        }
    }

    public async remove(purchaseId: string): Promise<void> {
        try {
            const oldPurchase = await this.findById(purchaseId);
            const purchaseUser = await UserService.findById(oldPurchase.userId);
            purchaseUser.balance += oldPurchase.amount;

            await UserService.save(purchaseUser);

            await this.getRepository().delete(purchaseId);
        } catch (error: any) {
            logger.error(
                `Remove operation failed in PurchaseService for id: ${purchaseId}`
            );
            throw new Error('remove_operation_failed_for_purchase_remove');
        }
    }

    private getRepository() {
        return getConnection().getRepository(Purchase);
    }
}

export default new PurchaseService();

import Purchase from '../entities/Purchase';
import { getConnection, Brackets } from 'typeorm';
import { Logger } from 'common';
import UserService from './UserService';
import PaginationOptions from '../types/PaginationOptions';
import { PurchaseCategoryEN, PurchaseCategoryHU } from 'enums/PurchaseCategory';
import config from 'config';
import moment from 'moment';

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

export type DownloadPurchasesExcelParamsType = {
    filter?: PurchaseFilterOptions;
};

export type DownloadedPurchasesTypeHU = {
    Dátum?: string;
    Összeg?: string;
    Kategória?: string;
    Összesen?: string;
};

export type DownloadedPurchasesTypeEN = {
    Date?: string;
    Amount?: string;
    Category?: string;
    Total?: string;
};

export type PurchaseList = [Purchase[], number];

const getPurchaseRepository = () => getConnection().getRepository(Purchase);

const list = async (
    userId: string,
    params?: PurchaseListParamsType
): Promise<PurchaseList> => {
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
            getPurchaseRepository().createQueryBuilder('purchase');
        queryBuilder.andWhere('purchase.userId = :userId', { userId });

        if (findParams.filter.category) {
            queryBuilder.andWhere('purchase.category = :category', {
                category: findParams.filter.category,
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
                    qb.where('purchase.created <= :to', {
                        to: findParams.filter.to + ' 23:59:59',
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
};

const getPurchasesExcel = async (
    userId: string,
    locale: string,
    params?: DownloadPurchasesExcelParamsType
): Promise<DownloadedPurchasesTypeHU[] | DownloadedPurchasesTypeEN[]> => {
    const defaultParams: DownloadPurchasesExcelParamsType = {
        filter: {},
    };

    const findParams: DownloadPurchasesExcelParamsType = {
        filter: { ...defaultParams.filter, ...params.filter },
    };

    try {
        const queryBuilder =
            getPurchaseRepository().createQueryBuilder('purchase');
        queryBuilder.andWhere('purchase.userId = :userId', { userId });

        if (findParams.filter.category) {
            queryBuilder.andWhere('purchase.category = :category', {
                category: findParams.filter.category,
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
                    qb.where('purchase.created <= :to', {
                        to: findParams.filter.to + ' 23:59:59',
                    });
                })
            );

            delete findParams.filter.to;
        }

        queryBuilder.orderBy('purchase.created', 'DESC');

        const purchases = await queryBuilder.getMany();

        const totalAmount =
            purchases.length > 0
                ? purchases
                      .map((purchase: Purchase) => purchase.amount)
                      .reduce(
                          (accum, current) => Number(accum) + Number(current)
                      )
                : 0;

        const finalPurchases = purchases.map((purchase: Purchase) => {
            delete purchase.id;
            delete purchase.modified;
            delete purchase.userId;

            if (locale === 'en') {
                return {
                    Date: moment(purchase.created).format(
                        'YYYY-MM-DD HH:mm:ss'
                    ),
                    Amount: `${purchase.amount}`,
                    Category: PurchaseCategoryEN[purchase.category],
                    Total: '',
                };
            } else {
                return {
                    Dátum: moment(purchase.created).format(
                        'YYYY-MM-DD HH:mm:ss'
                    ),
                    Összeg: `${purchase.amount}`,
                    Kategória: PurchaseCategoryHU[purchase.category],
                    Összesen: '',
                };
            }
        });

        if (locale === 'en') {
            finalPurchases.push({
                Date: '',
                Amount: '',
                Category: '',
                Total: `${totalAmount}`,
            });
        } else {
            finalPurchases.push({
                Dátum: '',
                Összeg: '',
                Kategória: '',
                Összesen: `${totalAmount}`,
            });
        }

        return finalPurchases;
    } catch (error: any) {
        console.log(error);
        logger.error('Create excel file failed in PurchaseService');
        throw new Error('create_excel_opetation_failed_in_PurchaseService');
    }
};

const create = async (purchase: Partial<Purchase>): Promise<Purchase> => {
    try {
        const newPurchase = purchase;
        newPurchase.userId = purchase.userId;

        const user = await UserService.findById(newPurchase.userId);

        user.balance -= newPurchase.amount;

        await UserService.save(user);
        const result = await getPurchaseRepository().save(newPurchase);

        return result;
    } catch (error: any) {
        logger.error('Error to create new purchase in PurchaseService');
        throw new Error('failed_to_create_new_purchase');
    }
};

const update = async (
    purchaseId: string,
    purchase: Partial<Purchase>
): Promise<Purchase> => {
    try {
        const oldPurchase = await findById(purchaseId);
        const purchaseUser = await UserService.findById(oldPurchase.userId);
        purchaseUser.balance += oldPurchase.amount;

        const updatedUser = await UserService.save(purchaseUser);

        oldPurchase.amount = purchase.amount;
        oldPurchase.category = purchase.category;
        oldPurchase.modified = new Date();

        const updatedPurchase = await getPurchaseRepository().save(oldPurchase);
        updatedUser.balance -= updatedPurchase.amount;

        await UserService.save(updatedUser);

        return updatedPurchase;
    } catch (error: any) {
        logger.error('Update operation failed in PurchaseService');
        throw new Error('update_operation_failed_in_PurchaseService');
    }
};

const findById = async (purchaseId: string): Promise<Purchase> => {
    try {
        const foundPurchase: Purchase = await getPurchaseRepository().findOne({
            where: { id: purchaseId },
        });

        return foundPurchase;
    } catch (error: any) {
        logger.error('Error to find purchase by id in PurchaseService');
        throw new Error('failed_to_find_puchase_by_id');
    }
};

const remove = async (purchaseId: string): Promise<void> => {
    try {
        const oldPurchase = await findById(purchaseId);
        const purchaseUser = await UserService.findById(oldPurchase.userId);
        purchaseUser.balance += oldPurchase.amount;

        await UserService.save(purchaseUser);

        await getPurchaseRepository().delete(purchaseId);
    } catch (error: any) {
        logger.error(
            `Remove operation failed in PurchaseService for id: ${purchaseId}`
        );
        throw new Error('remove_operation_failed_for_purchase_remove');
    }
};

export default {
    list,
    create,
    update,
    findById,
    remove,
    getPurchasesExcel,
};

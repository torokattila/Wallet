import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import config from '../config';
import User from '../models/User';
import StatusCodes from 'http-status-codes';
import PasswordChangePayload from './payloads/Profile/PasswordChangePayload';
import UserEditPayload from './payloads/Profile/UserEditPayload';
import IncomePayload from './payloads/Home/IncomePayload';
import Income from '../models/Income';
import Purchase from '../models/Purchase';
import moment from 'moment';
import PurchasePayload from './payloads/Home/PurchasePayload';

export const ApiURL =
    config.api.port !== 80 && config.api.port !== 443
        ? `${config.api.protocol}://${config.api.baseUrl}:${config.api.port}`
        : `${config.api.protocol}://${config.api.baseUrl}`;

export type PurchaseList = {
    purchases: Purchase[];
    totalNumber: number;
};

export type IncomeList = {
    incomes: Income[];
    totalNumber: number;
};

class ApiClient {
    protected readonly client: AxiosInstance;

    constructor() {
        axios.defaults.params = {};
        this.client = axios.create({ baseURL: ApiURL });
        this.client.interceptors.request.use(this.handleAuth);
        this.client.interceptors.response.use(
            (response) => response,
            this.handleUnauthorized
        );
    }

    private handleAuth = async (config: AxiosRequestConfig) => {
        const accessToken = localStorage.getItem('access_token');

        if (accessToken) {
            return config;
        } else {
            window.location.replace('/login');
            return config;
        }
    };

    private handleUnauthorized = (error: any) => {
        if (error?.response?.status === StatusCodes.UNAUTHORIZED) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            window.location.replace('/login');
            throw new axios.Cancel();
        } else {
            return Promise.reject(error);
        }
    };

    // User
    async getCurrentUser(): Promise<User> {
        const response: AxiosResponse<User> = await this.client.get<User>(
            `/me`,
            {
                headers: {
                    access_token: localStorage.getItem('access_token') || '',
                },
            }
        );
        return response.data;
    }

    async updateUser(userId: string, data: UserEditPayload): Promise<User> {
        const response: AxiosResponse<User> = await this.client.put(
            `/users/${userId}`,
            data,
            {
                headers: {
                    access_token: localStorage.getItem('access_token') || '',
                },
            }
        );
        return response.data;
    }

    async updateUserPassword(
        userId: string,
        data: PasswordChangePayload
    ): Promise<User> {
        const response: AxiosResponse<User> = await this.client.put(
            `/users/${userId}/password/update`,
            data,
            {
                headers: {
                    access_token: localStorage.getItem('access_token') || '',
                },
            }
        );
        return response.data;
    }

    // Incomes
    async listIncomes(
        page?: number,
        size?: number,
        from?: string,
        to?: string,
    ): Promise<IncomeList> {
        const params = [`page=${page}`, `size=${size}`];

        if (from) {
            params.push(`from=${moment(from).format('YYYY-MM-DD')}`);
        }

        if (to) {
            params.push(`to=${moment(to).format('YYYY-MM-DD')}`);
        }

        const response: AxiosResponse = await this.client.get<Income[]>(
            `/incomes?${params.join('&')}`,
            {
                headers: {
                    access_token: localStorage.getItem('access_token') || '',
                },
            }
        );
        const responseHeader =
            response.headers['X-Total-Count'] ||
            response.headers['x-total-count'];
        const result = {
            incomes: response.data,
            totalNumber: Number(responseHeader),
        };

        return result;
    }

    async postIncome(data: IncomePayload): Promise<Income> {
        const response: AxiosResponse<Income> = await this.client.post(
            '/incomes',
            data,
            {
                headers: {
                    access_token: localStorage.getItem('access_token') || '',
                },
            }
        );
        return response.data;
    }

    async deleteIncome(incomeId: string): Promise<Purchase> {
        const response: AxiosResponse<Purchase> = await this.client.delete(
            `/incomes/${incomeId}`,
            {
                headers: {
                    access_token: localStorage.getItem('access_token') || '',
                },
            }
        );
        return response.data;
    }

    // Purchases
    async listPurchases(
        page?: number,
        size?: number,
        from?: string,
        to?: string,
        category?: string
    ): Promise<PurchaseList> {
        const params = [`page=${page}`, `size=${size}`];

        if (!category) {
            params.push('category=');
        } else {
            params.push(`category=${category}`);
        }

        if (from) {
            params.push(`from=${moment(from).format('YYYY-MM-DD')}`);
        }

        if (to) {
            params.push(`to=${moment(to).format('YYYY-MM-DD')}`);
        }

        const response: AxiosResponse = await this.client.get<Purchase[]>(
            `/purchases?${params.join('&')}`,
            {
                headers: {
                    access_token: localStorage.getItem('access_token') || '',
                },
            }
        );
        const responseHeader =
            response.headers['X-Total-Count'] ||
            response.headers['x-total-count'];
        const result = {
            purchases: response.data,
            totalNumber: Number(responseHeader),
        };

        return result;
    }

    async postPurchase(data: PurchasePayload): Promise<Purchase> {
        const response: AxiosResponse<Purchase> = await this.client.post(
            '/purchases',
            data,
            {
                headers: {
                    access_token: localStorage.getItem('access_token') || '',
                },
            }
        );
        return response.data;
    }

    async updatePurchase(
        purchaseId: string,
        data: Purchase | undefined
    ): Promise<Purchase> {
        const response: AxiosResponse<Purchase> = await this.client.put(
            `/purchases/${purchaseId}`,
            data,
            {
                headers: {
                    access_token: localStorage.getItem('access_token') || '',
                },
            }
        );

        return response.data;
    }

    async deletePurchase(purchaseId: string): Promise<Purchase> {
        const response: AxiosResponse<Purchase> = await this.client.delete(
            `/purchases/${purchaseId}`,
            {
                headers: {
                    access_token: localStorage.getItem('access_token') || '',
                },
            }
        );
        return response.data;
    }
}

export default ApiClient;

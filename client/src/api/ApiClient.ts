import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import config from '../config';
import User from '../models/User';
import StatusCodes from 'http-status-codes';
import PasswordChangePayload from './payloads/Profile/PasswordChangePayload';
import UserEditPayload from './payloads/Profile/UserEditPayload';
import IncomePayload from './payloads/Home/IncomePayload';
import Income from '../models/Income';

export const ApiURL =
    config.api.port !== 80 && config.api.port !== 443
        ? `${config.api.protocol}://${config.api.baseUrl}:${config.api.port}`
        : `${config.api.protocol}://${config.api.baseUrl}`;

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
}

export default ApiClient;

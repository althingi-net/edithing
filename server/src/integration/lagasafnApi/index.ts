import axios, { AxiosRequestConfig } from 'axios';
import { lagasafnApi } from '../../config/lagasafnApi';

const config: AxiosRequestConfig = {
    headers: {
        'Content-Type': 'application/xml',
    },
};

export const postBillForValidation = async (billXml: string) => {
    try {
        await axios.post(
            lagasafnApi.url + '/api/bill/document/validate',
            billXml,
            config
        );
    } catch (error: any) {
        throw new Error(error?.response.data?.message ?? 'Unknown error');
    }
};

export const postBillForPublishing = async (billXml: string) => {
    try {
        await axios.post(
            lagasafnApi.url + '/api/bill/document/publish',
            billXml,
            config
        );
    } catch (error: any) {
        throw new Error(error?.response.data?.message ?? 'Unknown error');
    }
};

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
        // Do not interrupt processing in case of external service failure
        console.log('Request to lagasafn failed', error);
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
        // Do not interrupt processing in case of external service failure
        console.log('Request to lagasafn failed', error);
    }
};

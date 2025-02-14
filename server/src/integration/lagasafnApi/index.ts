import axios from 'axios';
import { lagasafnApi } from '../../config/lagasafnApi';

export const postBillForValidation = async (billXml: string) => {
    try {
        await axios.post(lagasafnApi.url, billXml);
    } catch (error) {
        console.log('Request to lagasafn failed', error);
    }
};
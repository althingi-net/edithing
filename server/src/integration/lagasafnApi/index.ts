import axios from 'axios';
import { lagasafnApi } from '../../config/lagasafnApi';

export const postBillForValidation = async (billXml: string) => {
    try {
        await axios.post(lagasafnApi.url + '/api/bill/validate', billXml);
    } catch (error) {
        console.log('Request to lagasafn failed', error);
    }
};

export const postBillForPublishing = ( billXml: string) => {
    console.log('Bill XML published!');
};

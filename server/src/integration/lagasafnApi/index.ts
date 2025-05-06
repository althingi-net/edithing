import axios from 'axios';
import { lagasafnApi } from '../../config/lagasafnApi';

axios.defaults.headers.post['Content-Type'] = 'application/xml';

export const postBillForValidation = async (billXml: string) => {
    try {
        await axios.post(lagasafnApi.url + '/api/bill/validate', billXml);
    } catch (error) {
        // FIXME: Let user know of error.
        console.log('Request to lagasafn failed', error);
    }
    console.log('Bill validated!');
};

export const postBillForPublishing = async (billXml: string) => {
    try {
        await axios.post(lagasafnApi.url + '/api/bill/publish', billXml);
    } catch (error) {
        // FIXME: Let user know of error.
        console.log('Request to lagasafn failed', error);
    }
    console.log('Bill XML published!');
};

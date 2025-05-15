import axios from 'axios';
import { lagasafnApi } from '../../config/lagasafnApi';

axios.defaults.headers.post['Content-Type'] = 'application/xml';

export const postBillForValidation = async (billXml: string) => {
    try {
        await axios.post(lagasafnApi.url + '/api/bill/document/validate', billXml);
    } catch (error: any) {
        throw new Error( <string>( error?.response.data?.message ?? 'Unknown error' ) );
    }
};

export const postBillForPublishing = async (billXml: string) => {
    try {
        await axios.post(lagasafnApi.url + '/api/bill/document/publish', billXml);
    } catch (error: any) {
        throw new Error( <string>( error?.response.data?.message ?? 'Unknown error' ) );
    }
};

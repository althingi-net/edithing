import axios from 'axios';
import { lagasafnApi } from '../../config/lagasafnApi';

axios.defaults.headers.post['Content-Type'] = 'application/xml';
axios.defaults.headers.post['Authorization'] = 'Bearer ' + lagasafnApi.api_access_token;

export const postBillMeta = async (billMetaXml: string) => {
    try {
        await axios.post(lagasafnApi.url + '/api/bill/meta', billMetaXml);
    } catch (error: any) {
        throw new Error( <string>( error?.response.data?.message ?? 'Unknown error' ) );
    }
};

export const postBillForValidation = async (billXml: string) => {
    try {
        await axios.post(lagasafnApi.url + '/api/bill/document/validate', billXml);
    } catch (error: any) {
        throw new Error( <string>( error?.response.data?.message ?? 'Unknown error' ) );
    }
};

export const postBillForPublishing = async (billNr: number, billXml: string) => {
    try {
        await axios.post(lagasafnApi.url + '/api/bill/' + String( billNr ) + '/document/publish', billXml);
    } catch (error: any) {
        throw new Error( <string>( error?.response.data?.message ?? 'Unknown error' ) );
    }
};

import axios from 'axios';
import { lagasafnApi } from '../../config/lagasafnApi';

const getConfig = () => {
    return {
        headers: {
            'Content-Type': 'application/xml',
            'Authorization': 'Bearer ' + lagasafnApi.api_access_token,
        },
    };
};

export const postBillMeta = async (billMetaXml: string) => {
    const url = lagasafnApi.url + '/api/bill/meta';

    try {
        await axios.post(url, billMetaXml, getConfig());
    } catch (error: any) {
        throw new Error( <string>( error?.response.data?.message ?? 'Unknown error' ) );
    }
};

export const postBillForValidation = async (billXml: string) => {
    const url = lagasafnApi.url + '/api/bill/document/validate';

    try {
        await axios.post(url, billXml, getConfig());
    } catch (error: any) {
        throw new Error( <string>( error?.response.data?.message ?? 'Unknown error' ) );
    }
};

export const postBillForPublishing = async (billNr: number, billXml: string) => {
    const url = lagasafnApi.url + '/api/bill/' + String( billNr ) + '/document/publish';

    try {
        await axios.post(url, billXml, getConfig());
    } catch (error: any) {
        throw new Error( <string>( error?.response.data?.message ?? 'Unknown error' ) );
    }
};

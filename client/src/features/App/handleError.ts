import { notification } from 'antd';
import { Translator } from './useLanguageContext';

const handleError = (error: any, t?: Translator) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(error);

        if (error.body) {
            console.error(error.body);
            error = error.body;
        }
    }

    notification.error(parseError(error, t));
};

const parseError = (error: any, t?: Translator) => {
    let message = error.name ?? 'Unknown Error';
    let description = error.message ?? '';
    
    if (error.message === 'Invalid law') {
        message = 'Invalid Law Document';
        description = 'At this time, only the Law Document XML format is supported.';
    }

    if (t) {
        message = t(message as string);
        description = t(description as string);
    }

    return { message, description };
};

export const handleErrorWithTranslations = (t: Translator) => (error: any) => handleError(error, t);

export default handleError;
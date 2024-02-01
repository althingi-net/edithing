import { notification } from 'antd';
import useLanguageContext from './useLanguageContext';

const useUserErrors = () => {
    const { t } = useLanguageContext();

    return {
        errorUnsavedChanges: () => notification.error({
            message: t('Unsaved Changes'),
            description: t('Current document contains changes, please save first.')
        }),
        errorLogin: () => notification.error({
            message: t('Login failed!'),
            description: t('Please check your credentials and try again.'),
        }),
    };
};

export default useUserErrors;
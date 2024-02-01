import { FC } from 'react';
import useLanguageContext from './useLanguageContext';

interface Props {
    error: any;
}

const UnknownError: FC<Props> = ({ error }) => {
    const { t } = useLanguageContext();
    
    return (
        <div role="alert">
            <p>{t('Something went wrong')}:</p>
            <pre>{error.message}</pre>
        </div>
    );
};

export default UnknownError;
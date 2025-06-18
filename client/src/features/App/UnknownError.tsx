import { FC } from 'react';
import { useTranslation } from './store/useTranslation';

interface Props {
    error: any;
}

const UnknownError: FC<Props> = ({ error }) => {
    const t = useTranslation();
    
    return (
        <div role="alert">
            <p>{t('Something went wrong')}:</p>
            <pre>{error.message}</pre>
        </div>
    );
};

export default UnknownError;
import { FC } from 'react';
import { useStore } from './store/useStore';

interface Props {
    error: any;
}

const UnknownError: FC<Props> = ({ error }) => {
    const t = useStore((state) => state.t);
    
    return (
        <div role="alert">
            <p>{t('Something went wrong')}:</p>
            <pre>{error.message}</pre>
        </div>
    );
};

export default UnknownError;
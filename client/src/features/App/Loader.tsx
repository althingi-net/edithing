import { Skeleton, Spin } from 'antd';
import { FC, PropsWithChildren } from 'react';
import useLanguageContext from './useLanguageContext';

interface Props {
    loading?: boolean;
}

const Loader: FC<PropsWithChildren<Props>> = ({ loading, children }) => {
    const { t } = useLanguageContext();
    const displayLoader = loading === undefined ? true : loading;
    
    if (!displayLoader) {
        return (
            <>
                {children}
            </>
        );
    }
    
    return (
        <Spin tip={t('Loading...')} size='large'>
            <Skeleton active={true} />
        </Spin>
    );
};

export default Loader;
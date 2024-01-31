import { Space } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { FC } from 'react';
import useLanguageContext from './useLanguageContext';

const NotFoundError: FC = () => {
    const { t } = useLanguageContext();
    
    return (
        <Content style={{ padding: '50px', textAlign: 'center' }}>
            <Space size='large' direction='vertical'>
                <h1>{t('Not Found')}</h1>
                <h3>{t('Please try another page.')}</h3>
            </Space >
        </Content>
    );
};

export default NotFoundError;
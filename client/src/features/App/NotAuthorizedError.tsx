import { Space } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { FC } from 'react';
import Header from './Header';
import useLanguageContext from './useLanguageContext';

const NotAuthorizedError: FC = () => {
    const { t } = useLanguageContext();
    
    return (
        <>
            <Header />
            <Content style={{ padding: '50px', textAlign: 'center' }}>
                <Space size='large' direction='vertical'>
                    <h1>{t('Error: Not Authorized')}</h1>
                    <h3>{t('Please login to continue.')}</h3>
                </Space >
            </Content>
        </>
    );
};

export default NotAuthorizedError;
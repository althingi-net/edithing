import { Button, Flex, List, Space, notification } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Bill, BillService } from 'client-sdk';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../features/App/Header';
import useLanguageContext from '../features/App/useLanguageContext';
import useSessionContext from '../features/App/useSessionContext';
import AddEntryButton from '../features/Bills/AddEntryButton';

const useBills = () => {
    const { isAuthenticated } = useSessionContext();
    const [bills, setBills] = useState<Bill[]>([]);

    const reload = useCallback(() => {
        if (!isAuthenticated()) {
            return;
        }
        BillService.billControllerGetAll()
            .then(setBills)
            .catch((error: Error) => notification.error({ message: error.message }));
    }, [isAuthenticated]);

    useEffect(reload, [reload]);

    return [bills, reload] as const;
};

const BillsPage = () => {
    const { t } = useLanguageContext();
    const navigate = useNavigate();
    const [bills, reload] = useBills();
    const { isAuthenticated } = useSessionContext();

    if (!isAuthenticated()) {
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
    }

    return (
        <>
            <Header />
            <Content style={{ padding: '50px', textAlign: 'center' }}>
                <Space size='large'>
                    <List
                        size="large"
                        style={{ minWidth: '600px', textAlign: 'left' }}
                        header={(
                            <>
                                <Flex align='center'>
                                    <h1 style={{ flexGrow: 1 }}>{t('Bills')}</h1>
                                    <AddEntryButton onSubmit={reload} />
                                </Flex>
                            </>
                        )}
                        bordered
                        dataSource={bills}
                        renderItem={(item) =>
                            <List.Item
                                style={{ width: '100%' }}
                                actions={[
                                    <Button key={0} onClick={() => navigate(`/bill/${item.id}`)}>{t('View')}</Button>
                                ]}
                            >
                                <List.Item.Meta
                                    title={`${item.title}`}
                                />
                            </List.Item>
                        }
                        pagination={{ position: 'bottom', align: 'center' }}
                    />
                </Space >
            </Content>
        </>
    );
};

export default BillsPage;
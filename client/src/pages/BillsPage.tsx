import { Button, Flex, List, Space } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Bill, BillService } from 'client-sdk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../features/App/Header';
import useLanguageContext from '../features/App/useLanguageContext';

const useBills = () => {
    const [bills, setBills] = useState<Bill[]>([]);

    useEffect(() => {
        BillService.billControllerGetAll().then(setBills);
    }, []);

    return bills;
};

const BillsPage = () => {
    const { t } = useLanguageContext();
    const navigate = useNavigate();
    const bills = useBills();

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
                                    <Button onClick={() => navigate('/bill/new')}>{t('New')}</Button>
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
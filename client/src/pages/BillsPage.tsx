import { Button, Flex, List, Space } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import NotAuthorizedError from '../features/App/NotAuthorizedError';
import UserAvatar from '../features/App/UserAvatar';
import useLanguageContext from '../features/App/useLanguageContext';
import useSessionContext from '../features/App/useSessionContext';
import CreateBillButton from '../features/Bills/CreateBillButton';
import useBills from '../features/Bills/useBills';

const BillsPage = () => {
    const { t } = useLanguageContext();
    const navigate = useNavigate();
    const [bills, reload] = useBills();
    const { isAuthenticated } = useSessionContext();

    if (!isAuthenticated()) {
        return <NotAuthorizedError />;
    }

    return (
        <Content style={{ padding: '50px', textAlign: 'center', height: 'calc(100% - 64px)' }}>
            <Space size='large'>
                <List
                    size="large"
                    style={{ minWidth: '600px', textAlign: 'left' }}
                    header={(
                        <>
                            <Flex align='center'>
                                <h1 style={{ flexGrow: 1 }}>{t('Bills')}</h1>
                                <CreateBillButton onSubmit={reload} />
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
                                avatar={<UserAvatar user={item.author} />}
                                title={item.title}
                                description={item.status}
                            />
                        </List.Item>
                    }
                    pagination={{ position: 'bottom', align: 'center' }}
                />
            </Space >
        </Content>
    );
};

export default BillsPage;
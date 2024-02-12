import { Button, Flex, List, Space } from 'antd';
import Search from 'antd/es/input/Search';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLanguageContext from '../App/useLanguageContext';
import filterLawEntry from './filterLawEntry';
import useLawListContext from './useLawListContext';

const DocumentSelector: FC = () => {
    const { t } = useLanguageContext();
    const [filter, setFilter] = useState('');
    const navigate = useNavigate();
    const { lawList } = useLawListContext();

    return (
        <Space size='large'>
            <List
                size="large"
                style={{ minWidth: '600px', textAlign: 'left' }}
                header={(
                    <>
                        <Flex align='center'>
                            <h1 style={{ flexGrow: 1 }}>{t('Legal Codex')}</h1>
                        </Flex>
                        <Search placeholder="filter" allowClear onChange={(event) => setFilter(event.target.value)} />
                    </>
                )}
                bordered
                dataSource={lawList.filter(filterLawEntry(filter))}
                renderItem={(item) =>
                    <List.Item
                        style={{ width: '100%' }}
                        actions={[
                            <Button key={0} onClick={() => navigate(`/law/${item.identifier}`)}>{t('View')}</Button>
                        ]}
                    >
                        <List.Item.Meta
                            title={`${item.identifier} - ${item.date}`}
                            description={item.name}
                        />
                    </List.Item>
                }
                pagination={{ position: 'bottom', align: 'center' }}
            />
        </Space >
    );
};

export default DocumentSelector;

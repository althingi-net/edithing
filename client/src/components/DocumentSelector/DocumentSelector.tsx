import { Button, Flex, List, Space } from 'antd';
import Search from 'antd/es/input/Search';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLawListContext from './useLawListContext';
import useLanguageContext from '../App/useLanguageContext';
import LanguageSelect from '../App/LanguageSelect';
import { GithubFile } from 'client-sdk';

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
                            <LanguageSelect />
                        </Flex>
                        <Search placeholder="filter" allowClear onChange={(event) => setFilter(event.target.value)} />
                    </>
                )}
                bordered
                dataSource={lawList.filter(filterLawEntry(filter))}
                renderItem={(item) =>
                    <List.Item
                        style={{ width: '100%' }}
                        actions={[<Button key={0} onClick={() => navigate(`/law/${item.identifier}`)}>{t('Edit')}</Button>]}
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

const filterLawEntry = (filter: string) => (item: GithubFile) => {
    const filterLower = filter.toLowerCase();

    return item.name.toLowerCase().includes(filterLower) ||
        item.identifier.toLowerCase().includes(filterLower) ||
        item.date.toLowerCase().includes(filterLower);
};

export default DocumentSelector;

import { Button, List, Space } from 'antd';
import Search from 'antd/es/input/Search';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GithubFile from '../../models/GithubFile';
import useLawListContext from './useLawListContext';

const DocumentSelector: FC = () => {
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
                        <h1>Law Entries</h1>
                        <Search placeholder="filter" allowClear onChange={(event) => setFilter(event.target.value)} />
                    </>
                )}
                bordered
                dataSource={lawList.filter(filterLawEntry(filter))}
                renderItem={(item) =>
                    <List.Item
                        style={{ width: '100%' }}
                        actions={[<Button key={0} onClick={() => navigate(`/law/${item.identifier}`)}>Edit</Button>]}
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

import { Button, List, Space } from "antd";
import { FC, useEffect, useState } from "react";
import GithubFile from "../../models/GithubFile";
import getLawEntries from "../../utils/getLawEntries";
import Search from "antd/es/input/Search";

interface Props {
    onFileSelect: (file: GithubFile) => void;
}

const filterLawEntry = (filter: string) => (item: GithubFile) => {
    const filterLower = filter.toLowerCase();

    return item.name.toLowerCase().includes(filterLower) ||
        item.identifier.toLowerCase().includes(filterLower) ||
        item.date.toLowerCase().includes(filterLower);
}

const DocumentSelector: FC<Props> = ({ onFileSelect }) => {
    const [data, setData] = useState<GithubFile[]>([]);
    const [filter, setFilter] = useState('');
    console.log('data', data);

    useEffect(() => {
        getLawEntries().then(setData);
    }, []);

    return (
        <Space direction="vertical" size='large'>
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
                dataSource={data.filter(filterLawEntry(filter))}
                renderItem={(item) =>
                    <List.Item
                        style={{ width: '100%' }}
                        actions={[<Button onClick={() => onFileSelect(item)}>Edit</Button>]}
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
    )
}

export default DocumentSelector;

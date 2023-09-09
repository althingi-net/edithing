import { Button, List, Space } from "antd";
import { FC, useEffect, useState } from "react";
import GithubFile from "../../models/GithubFile";
import getLawEntries from "../../utils/getLawEntries";

interface Props {
    onFileSelect: (file: GithubFile) => void;
}

const DocumentSelector: FC<Props> = ({ onFileSelect }) => {
    const [data, setData] = useState<GithubFile[]>([]);
    console.log('data', data);

    useEffect(() => {
        getLawEntries().then(setData);
    }, []);

    return (
        <Space direction="vertical" size='large'>
            <List
                size="large"
                style={{ minWidth: '300px', textAlign: 'left' }}
                header={<h1>Law Entries</h1>}
                bordered
                dataSource={data}
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

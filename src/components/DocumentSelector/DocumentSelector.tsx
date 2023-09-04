import { Button, List, Space } from "antd";
import { FC, useEffect, useState } from "react";
import getGitFiles, { GithubFile } from "../../utils/getGitFiles";

interface Props {
    onFileSelect: (file: GithubFile) => void;
}

const DocumentSelector: FC<Props> = ({ onFileSelect }) => {
    const [data, setData] = useState<GithubFile[]>([]);

    useEffect(() => {
        getGitFiles().then((result) => {
            console.log(result);
            setData(result);
        });
    }, []);

    return (
        <Space direction="vertical" size='large'>
            <List
                size="large"
                style={{ minWidth: '300px' }}
                header={<div>Select a bill to edit</div>}
                bordered
                dataSource={data}
                renderItem={(item) =>
                    <List.Item
                        style={{ width: '100%' }}
                        actions={[<Button onClick={() => onFileSelect(item)}>Load</Button>]}
                    >
                        {item.name}
                    </List.Item>
                }
                pagination={{ position: 'bottom', align: 'center' }}
            />
        </Space >
    )
}

export default DocumentSelector;

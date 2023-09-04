import { Button, List } from "antd";
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
    )
}

export default DocumentSelector;

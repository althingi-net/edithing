import { Button, Space } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useLawListContext from '../components/DocumentSelector/useLawListContext';
import Editor from '../components/Editor/Editor';

const LawPage: FC = () => {
    const navigate = useNavigate();
    const { nr, year } = useParams();
    const { lawList } = useLawListContext();
    const lawListEntry = lawList.find(law => law.identifier === `${nr}/${year}`);
    
    if (!lawListEntry) {
        if (lawList.length === 0) {
            return <h1>Loading...</h1>;
        }

        return <h1>Not found</h1>;
    }

    const { identifier, name } = lawListEntry;

    return (
        <Content style={{ padding: '50px' }}>
            <Space>
                <Button onClick={() => navigate('/')}>Back</Button>
                <h3>{identifier} {name}</h3>
            </Space>
            <Editor file={lawListEntry} />
        </Content>
    );
};

export default LawPage;
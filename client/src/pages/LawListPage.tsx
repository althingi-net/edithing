import { Content } from 'antd/es/layout/layout';
import DocumentSelector from '../features/Documents/DocumentSelector';

const LawListPage = () => {
    return (
        <Content style={{ padding: '50px', textAlign: 'center', height: 'calc(100% - 64px)', overflow: 'auto' }}>
            <DocumentSelector />
        </Content>
    );
};

export default LawListPage;
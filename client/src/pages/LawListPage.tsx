import { Content } from 'antd/es/layout/layout';
import DocumentSelector from '../features/DocumentSelector/DocumentSelector';
import Header from '../features/App/Header';

const LawListPage = () => {
    return (
        <>
            <Header />
            <Content style={{ padding: '50px', textAlign: 'center' }}>
                <DocumentSelector />
            </Content>
        </>
    );
};

export default LawListPage;
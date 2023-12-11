import { Content } from 'antd/es/layout/layout';
import DocumentSelector from '../components/DocumentSelector/DocumentSelector';
import Header from '../components/App/Header';

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
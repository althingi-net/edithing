import { Content } from "antd/es/layout/layout";
import DocumentSelector from "../components/DocumentSelector/DocumentSelector";

const LawListPage = () => {
    return (
        <Content style={{ padding: '50px', textAlign: 'center' }}>
            <DocumentSelector />
        </Content>
    )
}

export default LawListPage;
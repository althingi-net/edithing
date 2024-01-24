import { Col, Flex, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../features/App/Header';
import NotAuthorizedError from '../features/App/NotAuthorizedError';
import useLanguageContext from '../features/App/useLanguageContext';
import useSessionContext from '../features/App/useSessionContext';
import BillDocumentExplorer from '../features/Bills/BillDocumentExplorer';
import useBill from '../features/Bills/useBill';
import useLawListContext from '../features/DocumentSelector/useLawListContext';
import EditorLoader from '../features/Editor/EditorLoader';

const BillPage = () => {
    const { t } = useLanguageContext();
    // const navigate = useNavigate();
    const { isAuthenticated } = useSessionContext();
    let editorContent = null;
    const { id } = useParams();
    const [bill] = useBill(id);
    const { lawList } = useLawListContext();
    const [selected, setSelected] = useState<string | null>(null);

    if (!isAuthenticated()) {
        return <NotAuthorizedError />;
    }

    if (selected) {
        const lawListEntry = lawList.find(law => law.identifier === selected);

        if (!lawListEntry) {
            throw new Error('Law not found!');
        }

        const { identifier, name } = lawListEntry;

        editorContent = (
            <Content style={{ paddingLeft: '20px', height: '100%', overflow: 'auto'  }}>
                <EditorLoader key={identifier + name} file={lawListEntry} />
            </Content>
        );
    } else {
        editorContent = (
            <>
                <Flex align='center' gap='20px' style={{ height: '100%' }}>
                    <h1 style={{ flexGrow: 1, textAlign: 'center' }}>{t('Select a bill')}</h1>
                </Flex>
            </>
        );
    }


    return (
        <>
            <Header />
            <Content style={{ textAlign: 'left', padding: 20, height: 'calc(100% - 64px)' }}>
                <Row gutter={16} style={{ height: '100%' }}>
                    <Col span={4} style={{ height: '100%' }}>
                        <BillDocumentExplorer selected={selected} setSelected={setSelected} lawList={lawList} billDocuments={bill?.documents} />
                    </Col>
                    <Col span={20} style={{ height: '100%' }}>
                        {editorContent}
                    </Col>
                </Row>
            </Content>
        </>
    );
};

export default BillPage;
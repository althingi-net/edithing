import { Col, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BillDocumentService } from 'client-sdk';
import Header from '../features/App/Header';
import Loader from '../features/App/Loader';
import NotAuthorizedError from '../features/App/NotAuthorizedError';
import useLanguageContext from '../features/App/useLanguageContext';
import useSessionContext from '../features/App/useSessionContext';
import BillDocumentExplorer from '../features/Bills/BillDocumentExplorer';
import useBill from '../features/Bills/useBill';
import useLawListContext from '../features/DocumentSelector/useLawListContext';
import EditorLoader from '../features/Editor/EditorLoader';
import handleError from '../features/App/handleError';

const BillPage = () => {
    const { t } = useLanguageContext();
    const { isAuthenticated } = useSessionContext();
    let editorContent = null;
    const { id } = useParams();
    const [bill, reloadBill] = useBill(id);
    const { lawList } = useLawListContext();
    const [selected, setSelected] = useState<string | null>(null);

    const handleAddDocument = useCallback((identifier: string) => {
        if (!bill) {
            throw new Error('Bill not found');
        }

        BillDocumentService.billDocumentControllerCreate({ bill, identifier })
            .then(reloadBill)
            .then(() => setSelected(identifier))
            .catch(handleError);
    }, [bill, reloadBill]);

    if (!isAuthenticated()) {
        return <NotAuthorizedError />;
    }

    if (selected) {
        editorContent = (
            <EditorLoader key={selected} identifier={selected} />
        );
    } else {
        editorContent = (
            <h1 style={{ flexGrow: 1, textAlign: 'center' }}>{t('Select a bill')}</h1>
        );
    }

    return (
        <Loader loading={lawList.length === 0}>
            <Header />
            <Content style={{ textAlign: 'left', padding: 20, height: 'calc(100% - 64px)' }}>
                <Row gutter={16} style={{ height: '100%' }}>
                    <Col span={4} style={{ height: '100%' }}>
                        <BillDocumentExplorer
                            selected={selected}
                            setSelected={setSelected}
                            lawList={lawList}
                            billDocuments={bill?.documents}
                            onAddDocument={handleAddDocument}
                            onDeleteDocument={(identifier) => setSelected(identifier)}
                        />
                    </Col>
                    <Col span={20} style={{ height: '100%' }}>
                        <Content style={{ paddingLeft: '20px', height: '100%', overflow: 'auto'  }}>
                            {editorContent}
                        </Content>
                    </Col>
                </Row>
            </Content>
        </Loader>
    );
};

export default BillPage;
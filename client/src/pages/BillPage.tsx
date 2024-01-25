import { Col, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { BillDocumentService } from 'client-sdk';
import { FC, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../features/App/Header';
import Loader from '../features/App/Loader';
import NotAuthorizedError from '../features/App/NotAuthorizedError';
import handleError from '../features/App/handleError';
import useLanguageContext from '../features/App/useLanguageContext';
import useSessionContext from '../features/App/useSessionContext';
import BillDocumentExplorer from '../features/Bills/BillDocumentExplorer';
import useBill from '../features/Bills/useBill';
import useLawListContext from '../features/DocumentSelector/useLawListContext';
import EditorLoader from '../features/Editor/EditorLoader';

const BillPage: FC = () => {
    const { t } = useLanguageContext();
    const { isAuthenticated } = useSessionContext();
    const { id, identifier: selected } = useParams();
    const [bill, reloadBill] = useBill(id);
    const { lawList } = useLawListContext();
    const navigate = useNavigate();

    const select = useCallback((identifier: string) => {
        navigate(`/bill/${id}/document/${identifier}`);
    }, [id, navigate]);

    const handleAddDocument = useCallback((identifier: string) => {
        if (!bill) {
            throw new Error('Bill not found');
        }

        BillDocumentService.billDocumentControllerCreate({ bill, identifier })
            .then(reloadBill)
            .then(() => select(identifier))
            .catch(handleError);
    }, [bill, select, reloadBill]);

    if (!isAuthenticated()) {
        return <NotAuthorizedError />;
    }

    const editorContent = selected ? (
        <EditorLoader key={selected} identifier={selected} />
    ) : (
        <h1 style={{ flexGrow: 1, textAlign: 'center' }}>{t('Select a bill')}</h1>
    );

    return (
        <Loader loading={lawList.length === 0}>
            <Header />
            <Content style={{ textAlign: 'left', padding: 20, height: 'calc(100% - 64px)' }}>
                <Row gutter={16} style={{ height: '100%' }}>
                    <Col span={4} style={{ height: '100%' }}>
                        <BillDocumentExplorer
                            selected={selected}
                            setSelected={select}
                            lawList={lawList}
                            billDocuments={bill?.documents}
                            onAddDocument={handleAddDocument}
                            onDeleteDocument={(identifier) => select(identifier)}
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
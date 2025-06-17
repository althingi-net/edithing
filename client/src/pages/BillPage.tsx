import { Col, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Editor } from 'law-document-editor';
import { FC } from 'react';
import { useNavigate } from 'react-router';
import Loader from '../features/App/Loader';
import NotAuthorizedError from '../features/App/NotAuthorizedError';
import NotFoundError from '../features/App/NotFoundError';
import BillDocumentExplorer from '../features/Bills/BillDocumentExplorer';
import BillPreview from '../features/Bills/BillPreview';
import useBillPage from '../features/Bills/useBillPage';
import useLawListContext from '../features/Documents/useLawListContext';
import { useStore } from '../features/App/store/useStore';

const BillPage: FC = () => {
    const { isAuthenticated, isNavigationBlocked, setNavigationBlocked } = useStore();
    const navigate = useNavigate();
    const t = useStore((state) => state.t);
    // TODO: simplify this by creating a store slice
    const navigationBlocker = {
        blockNavigation: () => setNavigationBlocked(true),
        unblockNavigation: () => setNavigationBlocked(false),
        isNavigationBlocked,
        goTo: navigate,
    };
    const { lawList } = useLawListContext();
    const {
        bill,
        openDocument,
        selected,
        addDocument,
        deleteDocument,
        slate,
        xml,
        originalDocument,
        saveDocument,
        publishBill,
        hasBillLoadingError,
        hasDocumentLoadingError,
        isBillDocument,
        importError,
    } = useBillPage(isNavigationBlocked);

    if (!isAuthenticated()) {
        return <NotAuthorizedError />;
    }

    if (hasBillLoadingError) {
        return <NotFoundError />;
    }

    return (
        <Content style={{ textAlign: 'left', padding: '20px', height: 'calc(100% - 64px)' }}>
            <Row gutter={16} style={{ height: '100%' }}>
                <Col span={4} style={{ height: '100%' }}>
                    <Loader loading={lawList.length === 0}>
                        <BillDocumentExplorer
                            selected={selected}
                            setSelected={openDocument}
                            lawList={lawList}
                            billDocuments={bill?.documents}
                            onAddDocument={addDocument}
                            onDeleteDocument={deleteDocument}
                        />
                    </Loader>
                </Col>
                <Col span={20} style={{ height: '100%' }}>
                    <Content style={{ paddingLeft: '20px', height: '100%', overflow: 'hidden' }}>
                        {importError ? (
                            <>
                                <h1 style={{ flexGrow: 1, textAlign: 'center' }}>{t('Document not available')}</h1>
                                <p>{importError}</p>
                            </>
                        ) : hasDocumentLoadingError ? (
                            <>
                                <h1 style={{ flexGrow: 1, textAlign: 'center' }}>{t('Document not available')}</h1>
                                <h2 style={{ flexGrow: 1, textAlign: 'center' }}>{t('Select another law')}</h2>
                            </>
                        ) : selected ? (
                            <Loader loading={!slate || !originalDocument || !xml}>
                                <Editor
                                    key={selected}
                                    slate={slate!}
                                    originalDocument={originalDocument!}
                                    xml={xml!}
                                    saveDocument={saveDocument}
                                    publishBill={publishBill}
                                    readOnly={!isBillDocument}
                                    bill={bill}
                                    t={t}
                                    navigationBlocker={navigationBlocker}
                                />
                            </Loader>
                        ) : (
                            <Loader loading={!bill}>
                                <BillPreview bill={bill!} />
                            </Loader>
                        )}
                    </Content>
                </Col>
            </Row>
        </Content>
    );
};

export default BillPage;

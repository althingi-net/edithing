import { Col, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { FC } from 'react';
import Loader from '../features/App/Loader';
import NotAuthorizedError from '../features/App/NotAuthorizedError';
import NotFoundError from '../features/App/NotFoundError';
import useBlockNavigation from '../features/App/useBlockNavigation';
import useLanguageContext from '../features/App/useLanguageContext';
import useSessionContext from '../features/App/useSessionContext';
import BillDocumentExplorer from '../features/Bills/BillDocumentExplorer';
import BillPreview from '../features/Bills/BillPreview';
import useBillPage from '../features/Bills/useBillPage';
import useLawListContext from '../features/Documents/useLawListContext';
import Editor from '../features/Editor/Editor';

const BillPage: FC = () => {
    const { t } = useLanguageContext();
    const { isAuthenticated } = useSessionContext();
    const { isNavigationBlocked } = useBlockNavigation();
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
        hasBillLoadingError,
        hasDocumentLoadingError,
        isBillDocument,
        events,
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
                    <Content style={{ paddingLeft: '20px', height: '100%', overflow: 'hidden'  }}>
                        {hasDocumentLoadingError ? (
                            <>
                                <h1 style={{ flexGrow: 1, textAlign: 'center' }}>{t('Document not available')}</h1>
                                <h2 style={{ flexGrow: 1, textAlign: 'center' }}>{t('Select another law')}</h2>
                            </>
                        ) : selected ? (
                            <Loader loading={!slate || !originalDocument || !xml || !events}>
                                <Editor
                                    key={selected}
                                    slate={slate!}
                                    originalDocument={originalDocument!}
                                    xml={xml!}
                                    saveDocument={saveDocument}
                                    events={events}
                                    readOnly={!isBillDocument}
                                    bill={bill}
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
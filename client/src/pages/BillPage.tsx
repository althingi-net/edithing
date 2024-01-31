import { Col, Row, notification } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { BillDocumentService, DocumentService } from 'client-sdk';
import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LawEditor, getTitle } from 'law-document';
import Header from '../features/App/Header';
import Loader from '../features/App/Loader';
import NotAuthorizedError from '../features/App/NotAuthorizedError';
import handleError, { handleErrorWithTranslations } from '../features/App/handleError';
import useLanguageContext from '../features/App/useLanguageContext';
import useSessionContext from '../features/App/useSessionContext';
import BillDocumentExplorer from '../features/Bills/BillDocumentExplorer';
import useBill from '../features/Bills/useBill';
import useDocument from '../features/Documents/useDocument';
import useLawListContext from '../features/Documents/useLawListContext';
import Editor from '../features/Editor/Editor';
import useBlockNavigation from '../features/App/useBlockNavigation';

const useBillPage = (disableActions = false) => {
    const { t } = useLanguageContext();
    const { id, identifier: selected } = useParams();
    const [bill, reloadBill] = useBill(id);
    const navigate = useNavigate();
    const [isBillDocument, setIsBillDocument] = useState<boolean>(false);
    const { setDocument, xml, slate, originalDocument, documentId } = useDocument();

    const openDocument = useCallback((identifier?: string) => {
        if (disableActions) {
            return notification.error({ message: t('Unsaved Changes'), description: t('Current document contains changes, please save first.') });
        }

        if (!identifier) {
            navigate(`/bill/${id}`);
        } else {
            navigate(`/bill/${id}/document/${identifier}`);
        }
    }, [disableActions, id, navigate, t]);

    const addDocument = useCallback((identifier: string) => {
        if (disableActions) {
            return notification.error({ message: t('Unsaved Changes'), description: t('Current document contains changes, please save first.') });
        }

        if (!bill) {
            throw new Error('Bill not found');
        }

        BillDocumentService.billDocumentControllerCreate({ bill, identifier })
            .then(reloadBill)
            .then(() => openDocument(identifier))
            .catch(handleError);
    }, [bill, disableActions, openDocument, reloadBill, t]);

    const deleteDocument = useCallback((identifier: string) => {
        if (disableActions) {
            return notification.error({ message: t('Unsaved Changes'), description: t('Current document contains changes, please save first.') });
        }

        if (!bill || !bill.id) {
            throw new Error('Bill not found');
        }

        BillDocumentService.billDocumentControllerDelete(bill.id, identifier)
            .then(reloadBill)
            .then(() => openDocument())
            .catch(handleError);
    }, [bill, disableActions, openDocument, reloadBill, t]);

    const saveDocument = useCallback((editor: LawEditor) => {
        if (!selected || !slate || !documentId) {
            throw new Error('Invalid params');
        }

        const title = getTitle(editor.children);

        BillDocumentService.billDocumentControllerUpdate(documentId, { title, content: JSON.stringify(editor.children) })
            .then(() => notification.success({ message: t('Document saved') }))
            .then(reloadBill) // Update titles in the explorer
            .catch(handleError);
    }, [documentId, reloadBill, selected, slate, t]);

    const loadDocument = useCallback(() => {
        if (!bill || !bill.id || !selected) {
            return;
        }

        BillDocumentService.billDocumentControllerGet(bill.id, selected)
            .then(setDocument)
            .then(() => setIsBillDocument(true))
            .catch((error) => {
                // Fallback to document controller if the bill document is not found
                if (error.body.name === 'EntityNotFoundError') {
                    return DocumentService.documentControllerGet(selected)
                        .then(setDocument)
                        .then(() => setIsBillDocument(false))
                        .catch(handleErrorWithTranslations(t));
                }

                handleErrorWithTranslations(t)(error);
            });
    }, [bill, selected, setDocument, t]);

    useEffect(loadDocument, [loadDocument]);

    return {
        bill,
        openDocument,
        selected,
        addDocument,
        deleteDocument,
        saveDocument,
        isBillDocument,
        xml,
        slate,
        originalDocument,
        loadDocument,
    };
};


const BillPage: FC = () => {
    const { t } = useLanguageContext();
    const { isAuthenticated } = useSessionContext();
    const { isNavigationBlocked } = useBlockNavigation();
    const { lawList } = useLawListContext();
    const { bill, openDocument, selected, addDocument, deleteDocument, slate, xml, originalDocument, saveDocument } = useBillPage(isNavigationBlocked);

    if (!isAuthenticated()) {
        return <NotAuthorizedError />;
    }

    return (
        <>
            <Header />
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
                            {selected 
                                ? (
                                    <Loader loading={!slate || !originalDocument || !xml}>
                                        <Editor key={selected} slate={slate!} originalDocument={originalDocument!} xml={xml!} saveDocument={saveDocument} />
                                    </Loader>
                                ) : (
                                    <h1 style={{ flexGrow: 1, textAlign: 'center' }}>{t('Select a bill')}</h1>
                                )
                            }
                        </Content>
                    </Col>
                </Row>
            </Content>
        </>
    );
};

export default BillPage;
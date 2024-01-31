import { notification } from 'antd';
import { BillDocumentService, DocumentService } from 'client-sdk';
import { LawEditor, getTitle } from 'law-document';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { log } from '../../logger';
import handleError from '../App/handleError';
import useLanguageContext from '../App/useLanguageContext';
import useUserErrors from '../App/useUserErrors';
import useDocument from '../Documents/useDocument';
import useBill from './useBill';

const useBillPage = (disableActions = false) => {
    const { t } = useLanguageContext();
    const { id, identifier: selected } = useParams();
    const [bill, reloadBill] = useBill(id);
    const navigate = useNavigate();
    const [isBillDocument, setIsBillDocument] = useState<boolean>(false);
    const { setDocument, xml, slate, originalDocument, documentId } = useDocument();
    const { errorUnsavedChanges } = useUserErrors();
    const [hasError, setError] = useState(false);

    useEffect(() => {
        // reset error
        setError(false);
    }, [id, selected]);

    const openDocument = useCallback((identifier?: string) => {
        if (disableActions) {
            return errorUnsavedChanges();
        }

        log('open bill document', { id, bill, identifier });

        if (!identifier) {
            navigate(`/bill/${id}`);
        } else {
            navigate(`/bill/${id}/document/${identifier}`);
        }
    }, [bill, disableActions, errorUnsavedChanges, id, navigate]);

    const addDocument = useCallback((identifier: string) => {
        if (disableActions) {
            return errorUnsavedChanges();
        }

        if (!bill) {
            throw new Error('Bill not found');
        }

        log('add bill document', { bill, identifier });

        BillDocumentService.billDocumentControllerCreate({ bill, identifier })
            .then(reloadBill)
            .then(() => openDocument(identifier))
            .catch(handleError);
    }, [bill, disableActions, errorUnsavedChanges, openDocument, reloadBill]);

    const deleteDocument = useCallback((identifier: string) => {
        if (disableActions) {
            return errorUnsavedChanges();
        }

        if (!bill || !bill.id) {
            throw new Error('Bill not found');
        }

        log('delete bill document', { bill, identifier });

        BillDocumentService.billDocumentControllerDelete(bill.id, identifier)
            .then(reloadBill)
            .then(() => openDocument())
            .catch(handleError);
    }, [bill, disableActions, errorUnsavedChanges, openDocument, reloadBill]);

    const saveDocument = useCallback((editor: LawEditor) => {
        if (!selected || !slate || !documentId) {
            throw new Error('Invalid params');
        }

        const title = getTitle(editor.children);

        log('save bill document', { selected, documentId, title });

        BillDocumentService.billDocumentControllerUpdate(documentId, { title, content: JSON.stringify(editor.children) })
            .then(() => notification.success({ message: t('Document saved') }))
            .then(reloadBill) // Update titles in the explorer
            .catch(handleError);
    }, [documentId, reloadBill, selected, slate, t]);

    const loadDocument = useCallback(() => {
        if (!bill || !bill.id || !selected) {
            return;
        }

        log('load bill document', { bill, selected });

        BillDocumentService.billDocumentControllerGet(bill.id, selected)
            .then(setDocument)
            .then(() => setIsBillDocument(true))
            .catch((error) => {
                // Fallback to document controller if the bill document is not found
                if (error.body.name === 'HttpError') {
                    return DocumentService.documentControllerGet(selected)
                        .then((document) => {
                            setDocument(document);
                            setIsBillDocument(false);
                        })
                        .catch((error) => {
                            setError(true);
                            console.error(error);
                        });
                }

                setError(true);
                console.error(error);
            });
    }, [bill, selected, setDocument]);

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
        hasError,
    };
};

export default useBillPage;
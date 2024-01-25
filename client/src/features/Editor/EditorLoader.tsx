import { BillDocument, BillDocumentService, Document, DocumentService } from 'client-sdk';
import { FC, useEffect, useState } from 'react';
import { Descendant } from 'slate';
import Loader from '../App/Loader';
import { handleErrorWithTranslations } from '../App/handleError';
import useLanguageContext from '../App/useLanguageContext';
import Editor from './Editor';

interface EditorLoaderProps {
    identifier: string;
    billId?: number;
}

const EditorLoader: FC<EditorLoaderProps> = ({ identifier, billId }) => {
    const [xml, setXml] = useState<string>();
    const { t } = useLanguageContext();
    const [slate, setSlate] = useState<Descendant[] | null>(null);
    const [originalDocument, setOriginalDocument] = useState<Descendant[]>();
    
    const setDocument = (document: BillDocument | Document) => {
        setXml(document.originalXml);
        setOriginalDocument(JSON.parse(document.content) as Descendant[]);
        setSlate(JSON.parse(document.content) as Descendant[]);
    };

    useEffect(() => {
        if (billId) {
            BillDocumentService.billDocumentControllerGet(billId, identifier)
                .then(setDocument)
                .catch((error) => {
                    // Fallback to document controller if the bill document is not found
                    if (error.body.name === 'EntityNotFoundError') {
                        return DocumentService.documentControllerGet(identifier)
                            .then(setDocument)
                            .catch(handleErrorWithTranslations(t));
                    }

                    handleErrorWithTranslations(t)(error);
                });
        } else {
            DocumentService.documentControllerGet(identifier)
                .then(setDocument)
                .catch(handleErrorWithTranslations(t));
        }
        
    }, [billId, identifier, t]);

    if (!slate || !originalDocument || !xml) {
        return <Loader />;
    }

    return (
        <Editor slate={slate} originalDocument={originalDocument} xml={xml} />
    );
};

export default EditorLoader;
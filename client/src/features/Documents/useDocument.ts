import { BillDocument, Document } from 'client-sdk';
import { importXml, SlateFragment } from 'law-document';
import { useCallback, useState } from 'react';

const useDocument = () => {
    const [slate, setSlate] = useState<SlateFragment | null>(null);
    const [originalDocument, setOriginalDocument] = useState<SlateFragment>();
    const [xml, setXml] = useState<string>();
    const [documentId, setDocumentId] = useState<number>();
    const [gitHash, setGitHash] = useState<string>();
    const [importError, setImportError] = useState<string>();
    
    const setDocument = useCallback((document: BillDocument | Document | null) => {
        if (!document) {
            setXml(undefined);
            setOriginalDocument(undefined);
            setSlate(null);
            setGitHash(undefined);
            setDocumentId(undefined);
            setImportError(undefined);
            return;
        }

        setXml(document.originalXml);
        setOriginalDocument(importXml(document.originalXml));
        setSlate(JSON.parse(document.content) as SlateFragment);
        setDocumentId(document.id);
        setImportError(document.importError);
        
        if ('gitHash' in document) {
            setGitHash(document.gitHash);
        }
    }, []);

    return {
        setDocument,
        slate,
        originalDocument,
        xml,
        documentId,
        gitHash,
        importError,
    };
};

export default useDocument;
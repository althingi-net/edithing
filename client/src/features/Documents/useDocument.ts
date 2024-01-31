import { BillDocument, Document } from 'client-sdk';
import { useCallback, useState } from 'react';
import { Descendant } from 'slate';

const useDocument = () => {
    const [slate, setSlate] = useState<Descendant[] | null>(null);
    const [originalDocument, setOriginalDocument] = useState<Descendant[]>();
    const [xml, setXml] = useState<string>();
    const [documentId, setDocumentId] = useState<number>();
    
    const setDocument = useCallback((document: BillDocument | Document) => {
        setXml(document.originalXml);
        setOriginalDocument(JSON.parse(document.content) as Descendant[]);
        setSlate(JSON.parse(document.content) as Descendant[]);
        setDocumentId(document.id);
    }, []);

    return {
        setDocument,
        slate,
        originalDocument,
        xml,
        documentId,
    };
};

export default useDocument;
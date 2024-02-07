import { BillDocument, Document } from 'client-sdk';
import { Event, importXml } from 'law-document';
import { useCallback, useState } from 'react';
import { Descendant } from 'slate';

const useDocument = () => {
    const [slate, setSlate] = useState<Descendant[] | null>(null);
    const [originalDocument, setOriginalDocument] = useState<Descendant[]>();
    const [events, setEvents] = useState<Event[] | undefined>();
    const [xml, setXml] = useState<string>();
    const [documentId, setDocumentId] = useState<number>();
    
    const setDocument = useCallback((document: BillDocument | Document | null) => {
        if (!document) {
            setXml(undefined);
            setOriginalDocument(undefined);
            setSlate(null);
            setDocumentId(undefined);
            setEvents([]);
            return;
        }

        setXml(document.originalXml);
        setOriginalDocument(importXml(document.originalXml));
        setSlate(JSON.parse(document.content) as Descendant[]);
        setDocumentId(document.id);

        if ('events' in document && document.events) {
            setEvents(JSON.parse(document.events) as Event[]);
        }
    }, []);

    return {
        setDocument,
        slate,
        originalDocument,
        xml,
        documentId,
        events,
    };
};

export default useDocument;
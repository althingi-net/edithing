import { DocumentMetaElement } from '../../slate/element/DocumentMetaElement';
import { ElementType } from '../Slate';

export const createDocumentMeta = (meta: DocumentMetaElement['meta']): DocumentMetaElement => {
    const element: DocumentMetaElement = {
        type: ElementType.DOCUMENT_META,
        meta: deleteEmptyMeta(meta),
        children: [{ text: '' }],
    };

    return element;
};

const deleteEmptyMeta = (meta: DocumentMetaElement['meta']) => {
    const keys = Object.keys(meta) as (keyof DocumentMetaElement['meta'])[];
    const newMeta = { ...meta };

    keys.forEach(key => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (newMeta[key] === undefined) {
            delete newMeta[key];
        }
    });

    return newMeta;
};

export const createEmptyDocumentMeta = (): DocumentMetaElement => {
    const element: DocumentMetaElement = {
        type: ElementType.DOCUMENT_META,
        meta: {} as DocumentMetaElement['meta'],
        children: [{ text: '' }],
    };

    return element;
};
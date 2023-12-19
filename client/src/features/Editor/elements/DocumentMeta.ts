import { Descendant, Element, Node } from 'slate';
import { ElementType } from '../Slate';

interface DocumentMetaElement {
    type: ElementType.DOCUMENT_META;
    children: Descendant[];
    meta: DocumentMeta
}

export interface DocumentMeta {
    nr: string;
    year: string;
    name: string;
    date: string;
    original: string;
    ministerClause: string;
}

export const isDocumentMeta = (node?: Node | null): node is DocumentMetaElement => {
    return Element.isElementType(node, ElementType.DOCUMENT_META);
};

export default DocumentMetaElement;

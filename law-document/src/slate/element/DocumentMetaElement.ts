import { Element, Node } from 'slate';
import { ElementType, SlateFragment } from '../Slate';

export interface DocumentMetaElement {
    type: ElementType.DOCUMENT_META;
    children: SlateFragment;
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
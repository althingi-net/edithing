import { Descendant } from 'slate';
import { isDocumentMeta } from '../element/DocumentMetaElement';

export const getTitle = (slate: Descendant[]): string => {
    for (const node of slate) {
        if (isDocumentMeta(node)) {
            return node.meta.name || '';
        }
    }

    return '';
};
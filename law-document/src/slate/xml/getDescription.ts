import { isDocumentMeta } from '../element/DocumentMetaElement';
import { SlateFragment } from '../Slate';

export const getDescription = (slate: SlateFragment): string => {
    for (const node of slate) {
        if (isDocumentMeta(node)) {
            return node.meta.name || '';
        }
    }

    return '';
};

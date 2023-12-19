import { RenderElementProps } from 'slate-react';
import { TAGS } from '../../../config/tags';
import { ElementType } from '../Slate';
import { isDocumentMeta } from '../models/DocumentMeta';
import { isListItem } from '../models/ListItem';
import DocumentMetaBlock from './DocumentMetaBlock';

export function renderElement({ element, attributes, children }: RenderElementProps) {
    const className = [
        element.type,
        element.meta?.type,
    ].join(' ');

    if (isListItem(element)) {
        const config = element.meta ? TAGS[element.meta.type] : null;

        if (config) {
            if (config.display === 'inline' || element.meta?.styleNote === 'inline-with-parent') {
                return <span className={className} {...attributes}>{children}</span>;
            }

            if (config.display === 'block') {
                return <div className={className} {...attributes}>{children}</div>;
            }
        }
    }

    if (isDocumentMeta(element)) {
        return <DocumentMetaBlock element={element} attributes={attributes}>{children}</DocumentMetaBlock>;
    }

    switch (element.type) {
    case ElementType.LIST:
        return <ul className={className} {...attributes}>{children}</ul>;
    case ElementType.LIST_ITEM:
        return <li className={className} {...attributes}>{children}</li>;
    case ElementType.LIST_ITEM_TEXT:
        return <span className={className} {...attributes}>{children}</span>;
    case ElementType.PARAGRAPH:
    default:
        return <span className={className} {...attributes}>{children}</span>;
    }
}

export default renderElement;
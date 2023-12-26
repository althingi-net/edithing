import { RenderElementProps } from 'slate-react';
import DocumentMetaBlock from './DocumentMetaBlock';
import { isListItem, TAGS, isDocumentMeta, ElementType } from 'law-document';

function renderElement({ element, attributes, children }: RenderElementProps) {
    const className = [
        element.type,
        hasMetaType(element) ? element.meta.type : '',
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

const hasMetaType = (element: any): element is { meta: { type: string } } => {
    return 'meta' in element && element.meta && 'type' in element.meta;
};

export default renderElement;
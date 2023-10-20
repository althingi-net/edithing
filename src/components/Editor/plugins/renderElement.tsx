import { RenderElementProps } from 'slate-react';
import { ElementType } from '../Slate';
import { TAGS } from '../../../config/tags';

export function renderElement({ element, attributes, children }: RenderElementProps) {
    const config = element.meta ? TAGS[element.meta.type] : null;

    const className = [
        element.type,
        element.meta?.type,
    ].join(' ');

    if (config) {
        if (config.display === 'inline' || element.meta?.styleNote === 'inline-with-parent') {
            return <span className={className} {...attributes}>{children}</span>;
        }

        if (config.display === 'block') {
            return <div className={className} {...attributes}>{children}</div>;
        }
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
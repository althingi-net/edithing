import { RenderElementProps } from "slate-react";
import { ElementType } from "../Slate";
import { TAGS } from "../../../config/tags";

export function renderElement({ element, attributes, children }: RenderElementProps) {
    const config = TAGS[element.meta?.type];

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
        case ElementType.ORDERED_LIST:
            // @ts-ignore
            return <ul className={className} {...attributes}>{children}</ul>;
        case ElementType.UNORDERED_LIST:
            return <ul className={className} {...attributes}>{children}</ul>;
        case ElementType.LIST_ITEM:
            // @ts-ignore
            return <li className={className} value={element.value} {...attributes}>{children}</li>;
        case ElementType.LIST_ITEM_TEXT:
            return <span className={className} {...attributes}>{children}</span>;
        case ElementType.PARAGRAPH:
        default:
            return <span className={className} {...attributes}>{children}</span>;
    }
}

export default renderElement;
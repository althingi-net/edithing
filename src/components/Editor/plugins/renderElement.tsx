import { RenderElementProps } from "slate-react";
import { ElementType } from "../Slate";
import { TAGS } from "../Tags";

export function renderElement({ element, attributes, children }: RenderElementProps) {
    const config = TAGS[element.meta?.type];

    if (config) {
        if (config.display === 'inline' || element.meta?.styleNote === 'inline-with-parent') {
            return <span {...attributes}>{children}</span>;
        }

        if (config.display === 'block') {
            return <div {...attributes}>{children}</div>;
        }
    }

    switch (element.type) {
        case ElementType.ORDERED_LIST:
            // @ts-ignore
            return <ul {...attributes}>{children}</ul>;
        case ElementType.UNORDERED_LIST:
            return <ul {...attributes}>{children}</ul>;
        case ElementType.LIST_ITEM:
            // @ts-ignore
            return <li value={element.value} {...attributes}>{children}</li>;
        case ElementType.LIST_ITEM_TEXT:
            return <span {...attributes}>{children}</span>;
        case ElementType.PARAGRAPH:
        default:
            return <span {...attributes}>{children}</span>;
    }
}

export default renderElement;
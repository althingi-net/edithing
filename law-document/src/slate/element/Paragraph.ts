import { Element, Text } from 'slate';
import { ElementType } from '../Slate';

export interface Paragraph {
    type: ElementType.PARAGRAPH;
    children: Text[];
}

export const isParagraph = (node?: any): node is Paragraph => {
    return Element.isElementType(node, ElementType.PARAGRAPH);
};
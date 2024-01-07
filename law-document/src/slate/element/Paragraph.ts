import { Descendant } from 'slate';
import { ElementType } from '../Slate';

export interface Paragraph {
    type: ElementType.PARAGRAPH;
    children: Descendant[];
}
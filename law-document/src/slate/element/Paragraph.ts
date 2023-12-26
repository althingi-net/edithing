import { Text } from 'slate';
import { ElementType } from '../../old/Slate';

export interface Paragraph {
    type: ElementType.PARAGRAPH;
    children: Text[];
}
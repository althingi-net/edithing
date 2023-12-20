import { Text } from 'slate';
import { ElementType } from '../Slate';

interface Paragraph {
    type: ElementType.PARAGRAPH;
    children: Text[];
}

export default Paragraph;


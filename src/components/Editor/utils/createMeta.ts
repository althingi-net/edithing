import { Editor, Node, Path } from 'slate';
import increaseRomanNumber from './increaseRomanNumber';
import { ListItem, isList, isListItem } from '../Slate';
import getSiblingAbove from './getSiblingAbove';
import createListMeta from './createListMeta';

const createMeta = (editor: Editor, node: Node, path: Path) => {
    if (isList(node)) {
        if (path.length <= 2) {
            return createListMeta();
        }

        const parent = Node.get(editor, path.slice(0, -2));
        return createListMeta(parent);
    }

    if (isListItem(node)) {
        const siblingAbove = getSiblingAbove(editor, path);
        if (siblingAbove && isListItem(siblingAbove)) {
            const { nr, romanNr, nrType, type } = siblingAbove.meta;
            
            const meta: ListItem['meta'] = {
                type,
                nr: `${(Number(nr) ?? 0) + 1}`
            };

            if (nrType) {
                meta.nrType = nrType;
            }

            if (romanNr) {
                meta.romanNr = increaseRomanNumber(romanNr);
            }

            return meta;
        } else {
            const nextParent = Editor.above(editor, { at: path, match: n => isList(n) && !!n.meta });
            const meta = createListMeta(nextParent?.[0]) as ListItem['meta'];
    
            meta.nr = '1';
        
            if (meta.nrType === 'roman') {
                meta.romanNr = 'I';
            }
    
            return meta;
        }
    } 

    return {};
}


export default createMeta;
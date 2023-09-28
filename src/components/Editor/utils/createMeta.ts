import { Editor, Element, Node, Path } from 'slate';
import { ListItem, isList, isListItem } from '../Slate';
import createListMeta from './createListMeta';
import getPreviousSibling from './getPreviousSibling';
import increaseRomanNumber from './increaseRomanNumber';

const createMeta = <T extends Element>(editor: Editor, node: T, path: Path): T['meta'] => {
    if (isList(node)) {
        if (path.length <= 2) {
            return createListMeta();
        }

        const parent = Node.get(editor, path.slice(0, -2));
        return createListMeta(parent);
    }

    if (isListItem(node)) {
        const siblingAbove = getPreviousSibling(editor, path);
        if (siblingAbove && isListItem(siblingAbove)) {
            const { nr, romanNr, nrType, type, title } = siblingAbove.meta;
            
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

            if (title) {
                if (romanNr && meta.romanNr) {
                    meta.title = `${title.replace(romanNr, meta.romanNr)}`;
                } else {
                    meta.title = `${title.replace(nr, meta.nr)}`;
                }
            }

            return meta;
        } else {
            const nextParent = Editor.above(editor, { at: path, match: n => isList(n) && !!n.meta });
            const meta = createListMeta(nextParent?.[0]) as ListItem['meta'];
    
            meta.nr = '1';
        
            if (meta.nrType === 'roman') {
                meta.romanNr = 'I';
            }
    
            return meta as ListItem['meta'];
        }
    } 

    return null;
}


export default createMeta;
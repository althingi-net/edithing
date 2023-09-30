import { Editor, Element, Node, Path } from 'slate';
import { ListItem, isList, isListItem } from '../Slate';
import createListMeta from './createListMeta';
import getPreviousSibling from './getPreviousSibling';
import createListItemMetaFromSibling from './slate/createListItemMetaFromSibling';

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
            return createListItemMetaFromSibling(siblingAbove);
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
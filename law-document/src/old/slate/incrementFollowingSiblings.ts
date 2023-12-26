import { Editor, Path, Transforms } from 'slate';
import { isListItem } from '../../slate/element/ListItem';
import { log } from '../../logger';
import { incrementMixedNumber } from '../number/incrementMixedNumber';
import { incrementRomanNumber } from '../number/incrementRomanNumber';
import { setListItemMeta } from './setListItemMeta';

/**
 * Loops through siblings after current node and increments their nr attributes and titles
 * @param editor 
 * @param path Path at which to find following siblings and increment their nr attributes and titles
 */
export const incrementFollowingSiblings = (editor: Editor, path: Path) => {
    const previousSelection = editor.selection;
    const [parent, parentPath] = Editor.parent(editor, path);

    // loop siblings after current node
    for (let i = path.slice(-1)[0] + 1; i < parent.children.length; i++) {
        const sibling = parent.children[i];
        const siblingPath = [...parentPath, i];

        if (isListItem(sibling)) {
            if (!sibling.meta) {
                throw new Error('incrementFollowingSiblings: sibling.meta is undefined');
            }

            const nr = incrementMixedNumber(sibling.meta.nr, true);
            const newMeta = { ...sibling.meta, nr };
            if (newMeta.romanNr) {
                newMeta.romanNr = incrementRomanNumber(newMeta.romanNr);
            }

            log('incrementFollowingSiblings', { sibling, siblingPath, newMeta });
            setListItemMeta(editor, sibling, siblingPath, newMeta, { select: false });
        }
    }

    // Restore selection to go back to where it was before
    if (previousSelection) {
        Transforms.setSelection(editor, previousSelection);
    }
};
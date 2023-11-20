import { Editor, Path, Transforms } from 'slate';
import { isListItem } from '../../Slate';
import decrementMixedNumber from '../number/decrementMixedNumber';
import decrementRomanNumber from '../number/decrementRomanNumber';
import setListItemMeta from './setListItemMeta';
import { log } from '../../../../logger';

const decrementFollowingSiblings = (editor: Editor, path: Path) => {
    const previousSelection = editor.selection;
    const [parent, parentPath] = Editor.parent(editor, path);

    // loop siblings after current node
    for (let i = path.slice(-1)[0] + 1; i < parent.children.length; i++) {
        const sibling = parent.children[i];
        const siblingPath = [...parentPath, i];

        if (isListItem(sibling)) {
            if (!sibling.meta) {
                throw new Error('decrementFollowingSiblings: sibling.meta is undefined');
            }

            const nr = decrementMixedNumber(sibling.meta.nr, true);
            const newMeta = { ...sibling.meta, nr };
            if (newMeta.romanNr) {
                newMeta.romanNr = decrementRomanNumber(newMeta.romanNr);
            }

            log('decrementFollowingSiblings', { sibling, siblingPath, newMeta });
            setListItemMeta(editor, sibling, siblingPath, newMeta, { select: false });
        }
    }

    // Restore selection to go back to where it was before
    if (previousSelection) {
        Transforms.setSelection(editor, previousSelection);
    }
};

export default decrementFollowingSiblings;
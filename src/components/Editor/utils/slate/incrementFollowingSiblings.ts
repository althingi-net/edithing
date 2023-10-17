import { Editor, Transforms } from "slate";
import { isListItem } from "../../Slate";
import incrementMixedNumber from "../incrementMixedNumber";
import incrementRomanNumber from "../incrementRomanNumber";
import setListItemMeta from "./setListItemMeta";

const incrementFollowingSiblings = (editor: Editor, path: number[]) => {
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

            const newMeta = { ...sibling.meta, nr: `${incrementMixedNumber(sibling.meta.nr, true)}` };
            if (newMeta.romanNr) {
                newMeta.romanNr = incrementRomanNumber(newMeta.romanNr);
            }

            setListItemMeta(editor, sibling, siblingPath, newMeta);
        }
    }

    // Restore selection to go back to where it was before
    if (previousSelection) {
        Transforms.setSelection(editor, previousSelection);
    }
}

export default incrementFollowingSiblings;
import { Editor, Transforms } from "slate";
import { isListItem } from "../../Slate";
import createLawTitle from "../createLawTitle";
import incrementMixedNumber from "../incrementMixedNumber";
import incrementRomanNumber from "../incrementRomanNumber";
import getListItemTitle from "./getListItemTitle";
import setListItemTitle from "./setListItemTitle";
import setMeta from "./setMeta";

const incrementFollowingSiblings = (editor: Editor, path: number[]) => {
    const previousSelection = editor.selection;
    const [parent, parentPath] = Editor.parent(editor, path);

    // loop siblings after current node
    for (let i = path.slice(-1)[0] + 1; i < parent.children.length; i++) {
        const sibling = parent.children[i];
        const siblingPath = [...parentPath, i];

        if (isListItem(sibling)) {
            const newMeta = { ...sibling.meta, nr: `${incrementMixedNumber(sibling.meta.nr, true)}` };
            if (newMeta.romanNr) {
                newMeta.romanNr = incrementRomanNumber(newMeta.romanNr);
            }

            if (newMeta.title) {
                newMeta.title = createLawTitle(newMeta.nr, newMeta.type, newMeta.title);
            }

            setMeta(editor, siblingPath, newMeta);

            const previousTitle = getListItemTitle(editor, siblingPath);
            if (previousTitle) {
                setListItemTitle(editor, siblingPath, newMeta, previousTitle);
            }
        }
    }

    // Restore selection to go back to where it was before
    if (previousSelection) {
        Transforms.setSelection(editor, previousSelection);
    }
}

export default incrementFollowingSiblings;
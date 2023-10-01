import { Editor } from "slate";
import { MetaType } from "../Slate";
import createListItem from "../utils/slate/createListItem";
import createListItemMetaFromSibling from "../utils/slate/createListItemMetaFromSibling";
import findListItemAtSelection from "../utils/slate/findListItemAtSelection";
import incrementFollowingSiblings from "../utils/slate/incrementFollowingSiblings";

const createLawList = (editor: Editor, type: MetaType, bumpVersionNumber = true) => {
    if (!editor.selection) {
        console.error('Please put the cursor at the desired location in the text.');
        return;
    }

    const siblingListItem = findListItemAtSelection(editor, type);

    if (!siblingListItem) {
        console.error('No list found in the current selection');
        return;
    }
    
    const [node, path] = siblingListItem;
    const meta = createListItemMetaFromSibling(node);
    const newNode = createListItem(type, meta.nr, { ...meta })
    const newPath = path.slice(0, -1).concat([path.slice(-1)[0] + 1])

    editor.insertNode(newNode, { at: newPath, select: true })

    if (bumpVersionNumber) {
        incrementFollowingSiblings(editor, newPath)
    }
}

export default createLawList;
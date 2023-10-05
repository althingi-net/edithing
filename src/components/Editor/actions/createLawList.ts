import { onKeyDown } from "@prezly/slate-lists";
import { Editor, Node, Path } from "slate";
import { MetaType, isListItem } from "../Slate";
import createListItem from "../utils/slate/createListItem";
import createListItemMetaFromSibling from "../utils/slate/createListItemMetaFromSibling";
import incrementFollowingSiblings from "../utils/slate/incrementFollowingSiblings";

interface CreateLawListOptions {
    nested?: boolean;
    bumpVersionNumber?: boolean;
}

const createLawList = (editor: Editor, type: MetaType, path: Path, options: CreateLawListOptions = {}) => {
    const { nested, bumpVersionNumber } = options;
    const node = Node.get(editor, path);

    if (!isListItem(node)) {
        throw new Error('createLawList: node at path is not a list item');
    }

    const meta = createListItemMetaFromSibling(node);
    const newNode = createListItem(type, meta.nr, { ...meta })
    const newPath = path.slice(0, -1).concat([path.slice(-1)[0] + 1])

    editor.insertNode(newNode, { at: newPath, select: true })

    if (bumpVersionNumber && !nested) {
        incrementFollowingSiblings(editor, newPath)
    }

    if (nested) {
        onKeyDown.onTabIncreaseListDepth(editor, new KeyboardEvent('keydown', { key: 'Tab' }) as any)
    }
}

export default createLawList;
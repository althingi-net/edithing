import { Editor, Node, NodeEntry } from "slate";
import { ListItem, MetaType, isListItem } from "../../Slate";

/**
 * Return a list node of the given meta type in the current selection. 
 * Above the selection if possible, otherwise below: Below is last resort if selection is to high in the hierarchy.
 */
const findListItemAtSelection = (editor: Editor, tag: MetaType): NodeEntry<ListItem> | null => {
    if (!editor.selection) {
        return null;
    }

    const { anchor, focus } = editor.selection;
    const [node, location] = Node.common(editor, anchor.path, focus.path);
    
    if (!location) {
        return null;
    }

    if (isListItem(node) && node.meta?.type === tag) {
        return [node, location];
    }

    // check above
    const ancestor = editor.above<ListItem>({ at: location, match: node => isListItem(node) && node.meta?.type === tag })

    if (ancestor) {
        return ancestor;
    }

    // check children
    for (const [child, path] of Array.from(Node.children(editor, location, { reverse: true }))) {
        if (isListItem(child) && child.meta?.type === tag) {
            return [child, path];
        }
    }

    return null;
}

export default findListItemAtSelection;
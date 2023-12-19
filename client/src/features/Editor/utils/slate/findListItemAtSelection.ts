import { Editor, Node, NodeEntry, Text } from 'slate';
import { MetaType } from '../../Slate';
import { isListItem } from '../../elements/ListItem';
import ListItem from '../../elements/ListItem';

/**
 * Return a list node of the given meta type in the current selection. 
 * Above the selection if possible, otherwise below: Below is last resort if selection is to high in the hierarchy.
 */
const findListItemAtSelection = (editor: Editor, tag?: MetaType): NodeEntry<ListItem> | null => {
    if (!editor.selection) {
        return null;
    }

    const { anchor, focus } = editor.selection;
    const [node, location] = Node.common(editor, anchor.path, focus.path);

    if (isListItem(node) && (!tag || tag === node.meta?.type)) {
        return [node, location];
    }

    // check above
    const ancestor = editor.above<ListItem>({ at: location, match: node => isListItem(node) && (!tag || tag === node.meta?.type) });

    if (ancestor) {
        return ancestor;
    }

    // check children
    if (!Text.isText(node)) {
        for (const [child, path] of Array.from(Node.children(editor, location, { reverse: true }))) {
            if (isListItem(child) && (!tag || tag === child.meta?.type)) {
                return [child, path];
            }
        }
    }

    return null;
};

export default findListItemAtSelection;
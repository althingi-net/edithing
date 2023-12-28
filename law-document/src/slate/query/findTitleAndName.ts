import { Editor, Location, NodeEntry, Text } from 'slate';
import { findListItemAtSelection } from './findListItemAtSelection';

interface ReturnValue {
    title?: NodeEntry<Text>;
    name?: NodeEntry<Text>;
}

/**
 * Find title and name text nodes in a list item.
 * @param editor Slate editor
 * @param at Location of the list item. If not provided, the list item at the current selection will be used.
 * @returns 
 */
export const findTitleAndName = (editor: Editor, at?: Location): ReturnValue => {
    const result: ReturnValue = {};
    at = at ?? findListItemAtSelection(editor)?.[1];
    
    if (!at) {
        return result;
    }

    for (const [node, path] of Editor.nodes(editor, { at })) {
        if (Text.isText(node)) {
            if (node.title) {
                result.title = [node, path];
            } else if (node.name) {
                result.name = [node, path];
            }
        }
    }        

    return result;
};

findTitleAndName;
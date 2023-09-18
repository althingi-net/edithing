import { Editor, Element, Node, Text, Transforms } from "slate";
import { isList, isListItem } from "../Slate";
import createLawTitle from "../utils/createLawTitle";
import createMeta from "../utils/createMeta";
import increaseMixedNumber from "../utils/increaseMixedNumber";
import increaseRomanNumber from "../utils/increaseRomanNumber";

const withLawParagraphs = (editor: Editor) => {
    const { normalizeNode } = editor

    editor.normalizeNode = (entry) => {
        const [node, path] = entry

        // Add missing meta data
        if (!(node as any)['meta']) {
            if (isList(node)) {
                const meta = createMeta(editor, node, path);
                setMeta(editor, path, meta);
            }

            if (isListItem(node)) {
                const meta = createMeta(editor, node, path);
                setMeta(editor, path, meta);
                if (meta.title) {
                    setListItemTitle(editor, path, meta, meta.title);
                }
                bumpSiblingNumbers(editor, node, path);
            }
        }

        // Fall back to the original `normalizeNode` to enforce other constraints.
        normalizeNode(entry)
    }

    return editor
};

const bumpSiblingNumbers = (editor: Editor, node: Element, path: number[]) => {
    const previousSelection = editor.selection;
    const [parent, parentPath] = Editor.parent(editor, path);

    // loop siblings after current node
    for (let i = path.slice(-1)[0] + 1; i < parent.children.length; i++) {
        const sibling = parent.children[i];
        const siblingPath = [...parentPath, i];

        if (isListItem(sibling)) {
            const newMeta = { ...sibling.meta, nr: `${increaseMixedNumber(sibling.meta.nr)}` };
            if (newMeta.romanNr) {
                newMeta.romanNr = increaseRomanNumber(newMeta.romanNr);
            }

            if (newMeta.title) {
                newMeta.title = createLawTitle(newMeta.nr, newMeta.type, newMeta.title);
            }

            setMeta(editor, siblingPath, newMeta);

            const previousTitle = getListItemTitle(editor, siblingPath);
            setListItemTitle(editor, siblingPath, newMeta, previousTitle);
        }
    }

    // Restore selection to go back to where it was before
    if (previousSelection) {
        Transforms.setSelection(editor, previousSelection);
    }
}

const setMeta = (editor: Editor, path: number[], meta: any) => {
    Transforms.setNodes(editor, { meta }, { at: path });
}

const setListItemTitle = (editor: Editor, path: number[], meta: any, previousTitle?: string) => {
    const title = createLawTitle(meta.nr, meta.type, previousTitle);

    if (title) {
        Transforms.insertText(editor, title, { at: [...path, 0, 0] })
    }
}

const getListItemTitle = (editor: Editor, path: number[]) => {
    const node = Node.get(editor, [...path, 0, 0]);

    if (Text.isText(node)) {
        return node.text;
    }
}

export default withLawParagraphs;
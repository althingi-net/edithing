import { Editor, Transforms, Node, Element } from "slate";
import { ElementType, isList, isListItem } from "../Slate";
import createLawTitle from "../utils/createLawTitle";
import createMetaFromSibling from "../utils/createMetaFromSibling";
import increaseRomanNumber from "../../../utils/increaseRomanNumber";

const withLawParagraphs = (editor: Editor) => {
    const { normalizeNode } = editor

    editor.normalizeNode = (entry) => {
        const [node, path] = entry

        if (isList(node) || isListItem(node)) {
            if (!node.meta) {
                const meta = createMetaFromSibling(editor, path);
                setMeta(editor, node, path, meta);
                bumpSiblingNumbers(editor, node, path);
            }
        }

        // Fall back to the original `normalizeNode` to enforce other constraints.
        normalizeNode(entry)
    }

    return editor
};

function setMeta(editor: Editor, node: Element, path: number[], meta: any) {
    Transforms.setNodes(editor, { meta }, { at: path });
    
    // Set title
    if (isListItem(node)) {
        const title = createLawTitle(meta.nr, meta.type);

        if (title) {
            Transforms.insertText(editor, title, { at: [...path, 0, 0] })
        }
    }
}

const bumpSiblingNumbers = (editor: Editor, node: Element, path: number[]) => {
    const [parent, parentPath] = Editor.parent(editor, path);

    for (let i = path.slice(-1)[0] + 1; i < parent.children.length; i++) {
        const sibling = parent.children[i];
        const siblingPath = [...parentPath, i];

        if (isListItem(sibling)) {
            const newMeta = { ...sibling.meta, nr: `${Number(sibling.meta.nr) + 1}` };

            if (newMeta.romanNr) {
                newMeta.romanNr = increaseRomanNumber(newMeta.romanNr);
            }

            setMeta(editor, sibling, siblingPath, newMeta);
        }
    }
}

export default withLawParagraphs;
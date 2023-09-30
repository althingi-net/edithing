import { Editor } from "slate";
import { isList, isListItem } from "../Slate";
import createMeta from "../utils/createMeta";
import incrementFollowingSiblings from "../utils/slate/incrementFollowingSiblings";
import setListItemTitle from "../utils/slate/setListItemTitle";
import setMeta from "../utils/slate/setMeta";

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
                incrementFollowingSiblings(editor, path);
            }
        }

        // Continue with original `normalizeNode` to enforce other constraints.
        normalizeNode(entry)
    }

    return editor
};

export default withLawParagraphs;
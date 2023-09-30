import { Editor, Transforms } from "slate";
import createLawTitle from "../createLawTitle";

const setListItemTitle = (editor: Editor, path: number[], meta: any, previousTitle?: string) => {
    const title = createLawTitle(meta.nr, meta.type, previousTitle);

    if (title) {
        Transforms.insertText(editor, '', { at: [...path, 0, 0] });
        Transforms.insertNodes(editor, {
            text: title,
            title: true,
        }, { at: [...path, 0, 0] });
    }
}

export default setListItemTitle;
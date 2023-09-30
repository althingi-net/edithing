import { Editor, Transforms } from "slate";

const setMeta = (editor: Editor, path: number[], meta: any) => {
    Transforms.setNodes(editor, { meta }, { at: path });
}

export default setMeta;
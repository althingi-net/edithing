import { Editor, Transforms } from "slate";
import { ListItemMeta, ListMeta } from "../../Slate";

const setMeta = (editor: Editor, path: number[], meta: ListItemMeta | ListMeta) => {
    Transforms.setNodes(editor, { meta }, { at: path });
}

export default setMeta;
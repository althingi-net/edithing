import { Editor, Path, Transforms } from "slate";
import { ListItemMeta, ListMeta } from "../../Slate";

const setMeta = (editor: Editor, path: Path, meta: ListItemMeta | ListMeta) => {
    Transforms.setNodes(editor, { meta }, { at: path });
}

export default setMeta;
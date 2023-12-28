import { Editor, Path, Transforms } from 'slate';
import { ListMeta } from '../element/List';
import { ListItemMeta } from '../element/ListItem';

export const setMeta = (editor: Editor, path: Path, meta: ListItemMeta | ListMeta) => {
    Transforms.setNodes(editor, { meta }, { at: path });
};
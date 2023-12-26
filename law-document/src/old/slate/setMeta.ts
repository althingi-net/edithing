import { Editor, Path, Transforms } from 'slate';
import { ListMeta } from '../../slate/element/List';
import { ListItemMeta } from '../../slate/element/ListItem';

export const setMeta = (editor: Editor, path: Path, meta: ListItemMeta | ListMeta) => {
    Transforms.setNodes(editor, { meta }, { at: path });
};
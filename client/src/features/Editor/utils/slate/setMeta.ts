import { Editor, Path, Transforms } from 'slate';
import { ListMeta } from '../../models/List';
import { ListItemMeta } from '../../models/ListItem';

const setMeta = (editor: Editor, path: Path, meta: ListItemMeta | ListMeta) => {
    Transforms.setNodes(editor, { meta }, { at: path });
};

export default setMeta;
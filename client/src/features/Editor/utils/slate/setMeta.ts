import { Editor, Path, Transforms } from 'slate';
import { ListMeta } from '../../elements/List';
import { ListItemMeta } from '../../elements/ListItem';

const setMeta = (editor: Editor, path: Path, meta: ListItemMeta | ListMeta) => {
    Transforms.setNodes(editor, { meta }, { at: path });
};

export default setMeta;
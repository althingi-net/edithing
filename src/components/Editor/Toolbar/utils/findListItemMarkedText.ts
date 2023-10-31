import { Editor, Location, NodeEntry, Text } from 'slate';

const findListItemMarkedText = (
    editor: Editor,
    type: 'title' | 'name' | 'sentence',
    listItemPath: Location,
): NodeEntry<Text> | null => {
    const mark = type === 'sentence' ? 'nr' : type;
    const [entry] = editor.nodes<Text>({
        at: listItemPath,
        match: node => Text.isText(node) && Boolean(node[mark]),
    });

    return entry;
};

export default findListItemMarkedText;
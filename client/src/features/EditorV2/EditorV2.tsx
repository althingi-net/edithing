import { FC } from 'react';
import FlatEditorNode from './FlatEditorNode';
import { useEditorState } from './EditorStateContext';

const EditorV2: FC = () => {
    const { nodes } = useEditorState();

    if (!nodes.ids.length) {
        return null;
    }

    const content = Object.values(nodes.byId)
        .filter(node => !node.parent)
        .map((node) => <FlatEditorNode
            key={node.id}
            nodeId={node.id}
        />);

    return (
        <>
            {content}
        </>
    );
};

export default EditorV2;
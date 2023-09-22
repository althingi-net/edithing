import { RenderLeafProps } from "slate-react";

export const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    if (leaf.title) {
        return <span {...attributes} style={{ fontWeight: 'bold', marginRight: '10px' }}>{children}</span>;
    }
    if (leaf.name) {
        return <span {...attributes} style={{ fontStyle: 'italic', marginRight: '10px' }}>{children}</span>;
    }

    if (leaf.bold) {
        return <span {...attributes} style={{ fontWeight: 'bold' }}>{children}</span>;
    }

    return <span {...attributes}>{children}</span>;
}

export default renderLeaf;
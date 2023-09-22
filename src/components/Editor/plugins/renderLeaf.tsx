import { RenderLeafProps } from "slate-react";

export const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    if (leaf.title) {
        return <span {...attributes} className="title">{children}</span>;
    }

    if (leaf.name) {
        return <span {...attributes} className="name">{children}</span>;
    }

    if (leaf.bold) {
        return <span {...attributes} className="bold">{children}</span>;
    }

    return <span {...attributes}>{children}</span>;
}

export default renderLeaf;
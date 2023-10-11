/* eslint-disable react-hooks/rules-of-hooks */
import { RenderLeafProps } from "slate-react";
import useHighlightContext from "../Toolbar/useHighlightContext";

export const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    const highlight = useHighlightContext();

    if (leaf.title) {
        return <span {...attributes} className="title">{children}</span>;
    }

    if (leaf.name) {
        return <span {...attributes} className="name">{children}</span>;
    }

    if (leaf.bold) {
        return <span {...attributes} className="bold">{children}</span>;
    }

    if (highlight?.isHighlighted && leaf.nr) {
        const className = Number(leaf.nr) % 2 === 0 ? 'even' : 'odd';
        return <span {...attributes} className={className}>{children}</span>;
    }

    return <span {...attributes}>{children}</span>;
}

export default renderLeaf;
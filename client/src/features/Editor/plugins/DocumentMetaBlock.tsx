import { Collapse } from 'antd';
import { DocumentMetaElement, ElementType } from 'law-document';
import { FC } from 'react';
import { RenderElementProps } from 'slate-react';

interface Props extends RenderElementProps {
    element: DocumentMetaElement
}

const DocumentMetaBlock: FC<Props> = ({ attributes, element, children }) => {
    const { nr, year, name, original, ministerClause } = element.meta;

    const items = [{
        key: '1',
        label: `${nr}/${year} ${name}`,
        children: (
            <>
                <div className="meta-original">{original}</div>
                <div className="meta-minister-clause" dangerouslySetInnerHTML={{ __html: ministerClause }}></div>
            </>
        )
    }];

    return (
        <div className={ElementType.DOCUMENT_META} {...attributes} contentEditable={false}>
            <Collapse items={items} />
            {children}
        </div>
    );
};

export default DocumentMetaBlock;
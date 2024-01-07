/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { HocuspocusProvider } from '@hocuspocus/provider';
import { Col, Row } from 'antd';
import { withEvents, withLawParagraphs } from 'law-document';
import { FC, useEffect, useMemo, useState } from 'react';
import { Descendant, createEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { XmlElement } from 'yjs';
import './Editor.css';
import EditorSidePanel from './EditorSidePanel';
import HoveringToolbar from './Toolbar/HoverToolbar';
import SideToolbar from './Toolbar/SideToolbar';
import Toolbar from './Toolbar/Toolbar';
import useHighlightContext from './Toolbar/useHighlightContext';
import handleKeyDown from './plugins/handleKeyDown';
import renderElement from './plugins/renderElement';
import renderLeaf from './plugins/renderLeaf';
import { YjsEditor, withYjs } from './withYjs';

interface Props {
    slate: Descendant[];
    originalDocument: Descendant[];
    xml: string;
}

const Editor: FC<Props> = ({ /* slate, */ originalDocument, xml }) => {
    const highlight = useHighlightContext();

    const [value, setValue] = useState<Descendant[]>([]);
    const provider = useMemo(() => {
        return new HocuspocusProvider({
            url: 'ws://127.0.0.1:1234',
            name: '2',
            connect: false,
        });
    }, []);

    const editor = useMemo(() => {
        provider.document.on('update', () => {
            console.log('provider.document', provider.document);
        });

        const sharedType = provider.document.get('content', XmlElement) as XmlElement;
        console.log('sharedType', sharedType);
        // @ts-ignore
        const editor = withReact(withYjs(withEvents(withLawParagraphs(createEditor())), sharedType));
    
        return editor;
    }, [provider.document]);
    
    useEffect(() => {
        provider.connect();
        return () => provider.disconnect();
    }, [provider]);

    useEffect(() => {
        YjsEditor.connect(editor);
        return () => YjsEditor.disconnect(editor);
    }, [editor]);
    
    if (editor.sharedRoot.length === 0) {
        return <div>Loading...</div>;
    }

    const classNames = [
        'editor',
        highlight?.isHighlighted ? 'highlighted' : ''
    ].join(' ');

    return (
        <Slate editor={editor} initialValue={value} onChange={setValue}>
            <div style={{ minHeight: 'calc(100vh - 160px)' }}>
                <Row gutter={16} style={{ height: '100%' }}>
                    <Col span={12}>
                        <div style={{ height: '100%' }}>
                            <Toolbar />
                            <HoveringToolbar />
                            <SideToolbar />
                            <Editable
                                className={classNames}
                                onKeyDown={(event) => handleKeyDown(editor, event)}
                                renderElement={renderElement}
                                renderLeaf={renderLeaf}
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        <EditorSidePanel xml={xml} originalDocument={originalDocument} />
                    </Col>
                </Row>
            </div>
        </Slate>
    );
};

export default Editor;

import { Col, Row, notification } from 'antd';
import { FC, useEffect, useState } from 'react';
import { Descendant } from 'slate';
import { Editable, Slate } from 'slate-react';
import './Editor.css';
import EditorSidePanel from './EditorSidePanel';
import Toolbar from './Toolbar/Toolbar';
import createEditorWithPlugins from './plugins/createEditorWithPlugins';
import handleKeyDown from './plugins/handleKeyDown';
import renderElement from './plugins/renderElement';
import renderLeaf from './plugins/renderLeaf';
import useDebounce from './utils/useDebounce';
import importXml from './utils/xml/importXml';
import useHighlightContext from './Toolbar/useHighlightContext';
import HoveringToolbar from './Toolbar/HoverToolbar';
import SideToolbar from './Toolbar/SideToolbar';
import useLanguageContext from '../App/useLanguageContext';
import { DocumentService, GithubFile } from 'client-sdk';

interface Props {
    file: GithubFile;
}

const Editor: FC<Props> = ({ file }) => {
    const { t } = useLanguageContext();
    const [editor] = useState(createEditorWithPlugins);
    const [originalDocument, setOriginalDocument] = useState<ReturnType<typeof importXml>>();
    const [slate, setSlate] = useState<Descendant[] | null>(null);
    const debouncedSlate = useDebounce(slate, 500);
    const [xml, setXml] = useState<string>();
    const highlight = useHighlightContext();

    useEffect(() => {
        const [nr, year] = file.identifier.split('/');
        DocumentService.documentControllerGet(nr, year)
            .then((document) => setXml(document.content));
    }, [file]);

    useEffect(() => {
        if (xml) {
            console.log('xml', xml);
            try {
                const result = importXml(xml);
                setOriginalDocument(result);
                setSlate(result.slate);
            } catch (error) {
                notification.error({
                    message: t('Invalid Law Document'),
                    description: t('At this time, only the Law Document XML format is supported.'),
                });
            }
        }
    }, [t, xml]);

    if (!slate || !originalDocument || !debouncedSlate || !xml) {
        return null;
    }

    const classNames = [
        'editor',
        highlight?.isHighlighted ? 'highlighted' : ''
    ].join(' ');

    return (
        <Slate editor={editor} initialValue={slate} onChange={setSlate}>
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

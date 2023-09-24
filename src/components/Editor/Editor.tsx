import { onKeyDown } from '@prezly/slate-lists';
import { Col, Collapse, Row } from 'antd';
import { FC, useEffect, useMemo, useState } from "react";
import { CodeBlock } from 'react-code-blocks';
import { Descendant } from "slate";
import { Editable, Slate } from "slate-react";
import GithubFile from "../../models/GithubFile";
import CopyClipboardButton from './CopyClipboardButton';
import './Editor.css';
import NodeMetaForm from './NodeMetaForm';
import createEditorWithPlugins from './plugins/createEditorWithPlugins';
import renderElement from './plugins/renderElement';
import renderLeaf from './plugins/renderLeaf';
import compareDocuments from './utils/changelog/compareDocuments';
import useDebounce from './utils/useDebounce';
import downloadGitFile from './utils/xml/downloadGitFile';
import exportXml from './utils/xml/exportXml';
import importXml from './utils/xml/importXml';
import useEvents from './utils/changelog/useEvents';

interface Props {
    file: GithubFile;
}

const Editor: FC<Props> = ({ file }) => {
    console.log("Render Editor");
    const [editor] = useState(createEditorWithPlugins);
    const [originalDocument, setOriginalDocument] = useState<ReturnType<typeof importXml>>();
    const [slate, setSlate] = useState<Descendant[] | null>(null);
    const debouncedSlate = useDebounce(slate, 500);
    const [xml, setXml] = useState<string>();
    const events = useEvents(editor);

    useEffect(() => {
        console.log('events', events);
    }, [events]);

    useEffect(() => {
        downloadGitFile(file.path).then(setXml);
    }, [file]);

    useEffect(() => {
        if (xml) {
            const result = importXml(xml);
            setOriginalDocument(result)
            updateSlate(result.slate)
        }
    }, [xml]);

    const updateSlate = (value: Descendant[]) => {
        setSlate(value);
    }

    const sidepanel = useMemo(() => {
        if (!originalDocument || !debouncedSlate) {
            return null;
        }

        const slateState = JSON.stringify(debouncedSlate, null, 2);
        const xmlExport = exportXml(debouncedSlate, true, originalDocument.meta);
        const changelog = compareDocuments(originalDocument.slate, debouncedSlate, events);

        return (
            <div style={{ height: '100%' }}>
                <Collapse defaultActiveKey={[]} destroyInactivePanel>
                    <Collapse.Panel header="Paragraph Configuration" key="1">
                        <NodeMetaForm />
                    </Collapse.Panel>
                    <Collapse.Panel header="Old XML" key="2" extra={<CopyClipboardButton content={xml} />}>
                        <CodeBlock
                            text={xml}
                            language={'xml'}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="Slate" key="3" extra={<CopyClipboardButton content={slateState} />}>
                        <CodeBlock
                            text={slateState}
                            language={'json'}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="New XML" key="4" extra={<CopyClipboardButton content={xmlExport} />}>
                        <CodeBlock
                            text={xmlExport}
                            language={'xml'}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="Changes" key="5" extra={<CopyClipboardButton content={changelog} />}>
                        {changelog.length === 0 ? 'No changes' : (
                            changelog.map((change, index) => (
                                <div key={index}>
                                    <center>{index + 1}. gr.</center>
                                    <div>{change}</div>
                                </div>
                            ))
                        )}
                    </Collapse.Panel>
                </Collapse>
            </div>
        );
    }, [debouncedSlate, originalDocument, xml]);

    if (!slate || !originalDocument || !debouncedSlate) {
        return null;
    }

    return (
        <Slate editor={editor} initialValue={slate} onChange={updateSlate}>
            <div style={{ minHeight: 'calc(100vh - 160px)' }}>
                <Row gutter={16} style={{ height: '100%' }}>
                    <Col span={12}>
                        <div style={{ height: '100%' }}>
                            <Editable
                                className='editor'
                                onKeyDown={(event) => onKeyDown(editor, event)}
                                renderElement={renderElement}
                                renderLeaf={renderLeaf}
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        {sidepanel}
                    </Col>
                </Row>
            </div>
        </Slate >
    )
}

export default Editor;

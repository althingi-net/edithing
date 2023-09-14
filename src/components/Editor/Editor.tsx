import { onKeyDown } from '@prezly/slate-lists';
import { Col, Collapse, Row } from 'antd';
import { FC, useEffect, useMemo, useState } from "react";
import { CodeBlock } from 'react-code-blocks';
import { Descendant } from "slate";
import { Editable, Slate } from "slate-react";
import GithubFile from "../../models/GithubFile";
import { renderElement } from "./Slate";
import createEditorWithPlugins from './plugins/createEditorWithPlugins';
import exportXml from './utils/xml/exportXml';
import importXml from './utils/xml/importXml';
import downloadGitFile from './utils/xml/downloadGitFile';
import compareDocuments from './utils/changelog/compareDocuments';
import useDebounce from './utils/useDebounce';
import NodeMetaForm from './NodeMetaForm';

interface Props {
    file: GithubFile;
}

const Editor: FC<Props> = ({ file }) => {
    console.log("Render Editor");
    const [editor] = useState(createEditorWithPlugins)
    const [originalDocument, setOriginalDocument] = useState<ReturnType<typeof importXml>>();
    const [slate, setSlate] = useState<Descendant[] | null>(null);
    const debouncedSlate = useDebounce(slate, 500);
    const [xml, setXml] = useState<string>()

    useEffect(() => {
        downloadGitFile(file.path).then(setXml);
    }, [file]);

    useEffect(() => {
        if (xml) {
            const result = importXml(xml);
            setOriginalDocument(result)
            setSlate(result.slate)
        }
    }, [xml]);

    const sidepanel = useMemo(() => {
        if (!originalDocument || !debouncedSlate) {
            return null;
        }

        return (
            <div style={{ height: '100%' }}>
                <Collapse defaultActiveKey={[]} destroyInactivePanel>
                    <Collapse.Panel header="Paragraph Configuration" key="1">
                        <NodeMetaForm />
                    </Collapse.Panel>
                    <Collapse.Panel header="Old XML" key="2">
                        <CodeBlock
                            text={xml}
                            language={'xml'}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="Slate" key="3">
                        <CodeBlock
                            text={JSON.stringify(debouncedSlate, null, 2)}
                            language={'json'}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="New XML" key="4">
                        <CodeBlock
                            text={exportXml(debouncedSlate, true, originalDocument.meta)}
                            language={'xml'}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="Changes" key="5">
                        <CodeBlock
                            text={JSON.stringify(compareDocuments(originalDocument.slate, debouncedSlate), null, 2)}
                            language={'json'}
                        />
                    </Collapse.Panel>
                </Collapse>
            </div>
        );
    }, [debouncedSlate, originalDocument, xml]);

    if (!slate || !originalDocument || !debouncedSlate) {
        return null;
    }

    return (
        <Slate editor={editor} initialValue={slate} onChange={setSlate}>
            <div style={{ height: 'calc(100vh - 160px)' }}>
                <Row gutter={16} style={{ height: '100%' }}>
                    <Col span={12}>
                        <div style={{ height: '100%' }}>
                            <Editable
                                style={{ width: "100%", height: "100%", padding: "10px", border: "1px solid #ccc" }}
                                onKeyDown={(event) => onKeyDown(editor, event)}
                                renderElement={renderElement}
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

import { Collapse } from 'antd';
import { FC, useMemo } from 'react';
import { CodeBlock } from 'react-code-blocks';
import { useSlate } from 'slate-react';
import CopyClipboardButton from './CopyClipboardButton';
import LawChanges from './LawChanges';
import NodeMetaForm from './NodeMetaForm';
import compareDocuments from './utils/changelog/compareDocuments';
import useDebounce from './utils/useDebounce';
import exportXml from './utils/xml/exportXml';
import importXml from './utils/xml/importXml';

interface Props {
    originalDocument: ReturnType<typeof importXml>;
    xml: string;
}

const EditorSidePanel: FC<Props> = (props) => {
    const { originalDocument, xml } = props;
    const debouncedSlate = useDebounce(useSlate(), 500);

    return useMemo(() => {
        const slateState = JSON.stringify(debouncedSlate, null, 2);
        const xmlExport = exportXml(debouncedSlate, true, originalDocument.meta);
        const changelog = compareDocuments(originalDocument.slate, debouncedSlate.children, debouncedSlate.events);

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
                        <LawChanges changelog={changelog} />
                    </Collapse.Panel>
                </Collapse>
            </div>
        );
    // Note: Important to re-render on changes of debouncedSlate.events and debouncedSlate.children
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSlate, debouncedSlate.events, debouncedSlate.children, originalDocument, xml]);
};

export default EditorSidePanel;
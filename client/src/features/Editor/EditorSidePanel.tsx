import { Collapse } from 'antd';
import { FC, useMemo } from 'react';
import { CodeBlock } from 'react-code-blocks';
import { useSlate } from 'slate-react';
import { compareDocuments , exportChangelogXml , exportXml } from 'law-document';
import { Descendant } from 'slate';
import useLanguageContext from '../App/useLanguageContext';
import CopyClipboardButton from './CopyClipboardButton';
import LawChanges from './LawChanges';
import NodeMetaForm from './NodeMetaForm';
import useDebounce from './utils/useDebounce';

interface Props {
    originalDocument: Descendant[];
    xml: string;
    readOnly?: boolean;
}

const EditorSidePanel: FC<Props> = (props) => {
    const { t } = useLanguageContext();
    const { originalDocument, xml, readOnly } = props;
    const debouncedSlate = useDebounce(useSlate(), 500);

    return useMemo(() => {
        const slateState = JSON.stringify(debouncedSlate.children, null, 2);
        const xmlExport = exportXml(debouncedSlate, true);
        const changelog = compareDocuments(debouncedSlate, originalDocument);

        return (
            <div style={{ height: 'calc(100vh - 104px)', overflowY: 'auto' }}>
                <Collapse defaultActiveKey={['5']} destroyInactivePanel>
                    <Collapse.Panel
                        key="1"
                        header={t('Element Configuration')}
                        collapsible={readOnly ? 'disabled' : undefined}
                    >
                        <NodeMetaForm />
                    </Collapse.Panel>
                    <Collapse.Panel
                        key="2"
                        header={t('Old XML')}
                        extra={<CopyClipboardButton content={xml} />}
                    >
                        <CodeBlock
                            text={xml}
                            language={'xml'}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel
                        key="3"
                        header="Slate"
                        extra={<CopyClipboardButton content={slateState} />}
                    >
                        <CodeBlock
                            text={slateState}
                            language={'json'}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel
                        key="4"
                        header={t('New XML')}
                        extra={<CopyClipboardButton content={xmlExport} />}
                    >
                        <CodeBlock
                            text={xmlExport}
                            language={'xml'}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel
                        key="5"
                        header={t('Changes')}
                        extra={<CopyClipboardButton content={changelog} transform={exportChangelogXml} />}
                        collapsible={readOnly ? 'disabled' : undefined}
                    >
                        <LawChanges changelog={changelog} />
                    </Collapse.Panel>
                </Collapse>
            </div>
        );
    // Note: Important to re-render on changes of debouncedSlate.events and debouncedSlate.children
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSlate, debouncedSlate.events, debouncedSlate.children, originalDocument, xml, t]);
};

export default EditorSidePanel;
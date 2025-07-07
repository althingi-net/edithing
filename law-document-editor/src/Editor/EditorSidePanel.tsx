import { Collapse } from 'antd';
import { exportSpeechXml, exportXml, SlateFragment } from 'law-document';
import React, { FC, useMemo } from 'react';
import { CodeBlock } from 'react-code-blocks';
import { useSlate } from 'slate-react';
import { Translator } from '../translations';
import { useDebounce } from '../utils/useDebounce';
import { CopyClipboardButton } from './CopyClipboardButton';
import { LawDiff } from './LawDiff';
import { NodeMetaForm } from './NodeMetaForm';

interface Props {
    originalDocument?: SlateFragment;
    xml?: string;
    readOnly?: boolean;
    isSpeech?: boolean;
    t: Translator;
}

export const EditorSidePanel: FC<Props> = (props) => {
    const { originalDocument, xml, readOnly, isSpeech, t } = props;
    const debouncedSlate = useDebounce(useSlate(), 500);

    return useMemo(() => {
        const slateState = JSON.stringify(debouncedSlate.children, null, 2);
        const xmlExport = isSpeech ? exportSpeechXml(debouncedSlate, true) : exportXml(debouncedSlate, true);

        // Build items array for Collapse
        const items = [
            {
                key: '1',
                label: t('Element Configuration'),
                children: <NodeMetaForm t={t} />,
                ...(readOnly ? { collapsible: 'disabled' as const } : {}),
            },
            ...(
                xml
                    ? [{
                        key: '2',
                        label: t('Old XML'),
                        extra: <CopyClipboardButton t={t} content={xml} />,
                        children: <CodeBlock text={xml} language={'xml'} />,
                    }]
                    : []
            ),
            {
                key: '3',
                label: 'Slate',
                extra: <CopyClipboardButton t={t} content={slateState} />,
                children: <CodeBlock text={slateState} language={'json'} />,
            },
            {
                key: '4',
                label: t('New XML'),
                extra: <CopyClipboardButton t={t} content={xmlExport} />,
                children: <CodeBlock text={xmlExport} language={'xml'} />,
            },
            ...(
                originalDocument
                    ? [{
                        key: '5',
                        label: t('Changes'),
                        ...(readOnly ? { collapsible: 'disabled' as const } : {}),
                        children: <LawDiff originalDocument={originalDocument} slate={debouncedSlate} t={t} />,
                    }]
                    : []
            ),
        ];

        return (
            <div style={{ height: 'calc(100vh - 146px)', overflowY: 'auto' }}>
                <Collapse defaultActiveKey={['5']} destroyInactivePanel items={items} />
            </div>
        );
    // Note: Important to re-render on changes of debouncedSlate.children
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSlate, debouncedSlate.children, originalDocument, xml, t]);
};
import { useDebounce } from '@uidotdev/usehooks';
import { Typography } from 'antd';
import { LawEditor, SlateFragment } from 'law-document';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useSlate } from 'slate-react';
import { Translator } from '../translations';
import { diffLaw, LawDiffResult } from '../utils/diffLaw';

const { Text } = Typography;

interface Props {
    slate: LawEditor;
    originalDocument: SlateFragment;
    t: Translator;
}

export const LawDiff: FC<Props> = ({ originalDocument, t }) => {
    const slate = useSlate();
    const [diff, setDiff] = useState<LawDiffResult[]>([]);
    const debouncedChildren = useDebounce(slate.children, 250);

    useEffect(() => {
        void diffLaw({ children: debouncedChildren } as LawEditor, originalDocument).then(setDiff);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedChildren]);

    if (diff.length === 0) {
        return (
            <span>{t('No changes')}</span>
        );
    }

    const changes = diff.map(({ id, changes }, index) => {
        return (
            <div key={`${id}-${index}`} style={{ position: 'relative' }}>
                <div>{parseIdToDisplay(t, id)}</div>
                <div>
                    <ol type='a'>
                        <LawChanges key={`${id}-${index}`} changes={changes ?? []} />
                    </ol>
                </div>
            </div>
        );
        
    });

    return (
        <div>
            {changes}
        </div>
    );
};

const LawChanges: FC<{ changes: [type: number, text: string][] }> = ({ changes }) => {
    return useMemo(() => (
        <div>
            {changes.map(([type, value], index) => {
                if (type === 1) {
                    return <Text key={`${value} / ${index} / ${type}`} type="success" strong>{value}</Text>;
                }

                if (type === -1) {
                    return <Text key={`${value} / ${index}`} type="danger" delete strong>{value}</Text>;
                }

                return <Text key={`${value} / ${index}`}>{value}</Text>;
            })}
        </div>
    ), [changes]);
};

const parseIdToDisplay = (t: Translator, id: string) => {
    return id.split('.')
        .map(level => level.split('-'))
        .map(([type, nr]) => nr ? `${nr}. ${t(type)}.` : `${t(type)}`)
        .reverse()
        .join(' ');
};
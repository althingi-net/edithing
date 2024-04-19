/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { PlusCircleOutlined } from '@ant-design/icons';
import { useHover } from '@uidotdev/usehooks';
import { Button, Typography } from 'antd';
import { Changelog, groupChangesByArticle, parseIdToDisplay } from 'law-document';
import { FC } from 'react';
import useLanguageContext, { Translator } from '../App/useLanguageContext';

const { Text } = Typography;

interface Props {
    changelog: Changelog[];
    displayFullTextOnly?: boolean;
}


const LawChanges: FC<Props> = ({ changelog }) => {
    const { t } = useLanguageContext();

    if (changelog.length === 0) {
        return (
            <span>{t('No changes')}</span>
        );
    }

    const groupedChanges = groupChangesByArticle(changelog);
    const renderedChanges = Object.entries(groupedChanges).map(([id, changes], index) => {
        return (
            <div key={`${id}-${index}`} style={{ position: 'relative' }}>
                <div>{parseIdToDisplay(t, id)}</div>
                <div>
                    <ol type='a'>
                        {changes.map((change) => (
                            <LawChange key={change.id} entry={change} />
                        ))}
                    </ol>
                </div>
            </div>
        );
    });

    return (
        <div>
            {renderedChanges}
        </div>
    );
};

const LawChange: FC<{ entry: Changelog }> = ({ entry }) => {
    const { t } = useLanguageContext();
    const [ref, hovering] = useHover();

    const buttons = [
        entry.type === 'changed' && (
            <Button type='primary' size='small' icon={<PlusCircleOutlined />} title='Mark change as added' onClick={() => entry.type = 'added'} />
        ),
    ];

    return (
        <div ref={ref}>
            <li key={entry.id}>
                <div style={{ position: 'absolute', right: '-10px', display: hovering ? 'block' : 'none' }}>
                    {buttons}
                </div>
                {parseChange(t, entry)}
            </li>
        </div>
    );
};

const parseChange = (t: Translator, entry: Changelog) => {
    const id = parseIdToDisplay(t, entry.id);

    if (entry.type === 'added') {
        return `${id} ${t('of the law was added')}: ${entry.text}`;
    }

    if (entry.type === 'deleted') {
        return `${id} ${t('of the law was removed.')}`;
    }

    if (!entry.changes) {
        return `${id} ${t('of the law shall be')}: ${entry.text}`;
    }

    return (
        <>
            {id} {t('of the law shall be')}: {embedChangesToText(entry.changes)}
        </>
    );

    return '';
};

const embedChangesToText = (changes: NonNullable<Changelog['changes']>) => {
    return (
        <span>
            {changes.map(([type, value]) => {
                if (type === 1) {
                    return <Text key={value} type="success" strong>{value}</Text>;
                }

                if (type === -1) {
                    return <Text key={value} type="danger" delete strong>{value}</Text>;
                }

                return <Text key={value}>{value}</Text>;
            })}
        </span>
    );
};

export default LawChanges;
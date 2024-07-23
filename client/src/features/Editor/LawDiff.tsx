import { Typography } from 'antd';
import { LawEditor } from 'law-document';
import { FC } from 'react';
import { Descendant } from 'slate';
import { useSlate } from 'slate-react';
import useLanguageContext, { Translator } from '../App/useLanguageContext';
import { Changelog, diffLaw } from './utils/diffLaw';

const { Text } = Typography;

interface Props {
    slate: LawEditor;
    originalDocument: Descendant[];
}


const LawDiff: FC<Props> = ({ originalDocument }) => {
    const slate = useSlate();
    const { t } = useLanguageContext();
    const changelog = diffLaw(slate, originalDocument);

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

const groupChangesByArticle = (changelog: Changelog[]) => {
    const changes: Record<string, Changelog[]> = {};

    changelog.forEach(change => {
        const articleId = change.id.split('.')[1] ?? change.id;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!changes[articleId]) {
            changes[articleId] = [];
        }

        changes[articleId].push(change);
    });

    return changes;
};

const LawChange: FC<{ entry: Changelog }> = ({ entry }) => {
    const { t } = useLanguageContext();

    return (
        <div>
            <li key={entry.id}>
                {parseChange(t, entry)}
            </li>
        </div>
    );
};

const parseIdToDisplay = (t: Translator, id: string) => {
    return id.split('.')
        .map(level => level.split('-'))
        .map(([type, nr]) => nr ? `${nr}. ${t(type)}.` : `${t(type)}`)
        .reverse()
        .join(' ');
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

export default LawDiff;
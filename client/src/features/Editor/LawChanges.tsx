/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { FC, useState } from 'react';
import { Changelog , groupChangesByArticle, parseIdToDisplay } from 'law-document';
import { Switch, Typography } from 'antd';
import useLanguageContext, { Translator } from '../App/useLanguageContext';

const { Text } = Typography;

interface Props {
    changelog: Changelog[];
    displayFullTextOnly?: boolean;
}


const LawChanges: FC<Props> = ({ changelog, displayFullTextOnly }) => {
    const { t } = useLanguageContext();
    const [showOnlyDifference, setShowOnlyDifference] = useState(true);

    if (changelog.length === 0) {
        return (
            <span>{t('No changes')}</span>
        );
    }

    const groupedChanges = groupChangesByArticle(changelog);
    const renderedChanges = Object.entries(groupedChanges).map(([id, changes], index) => {
        return (
            <div key={`${id}-${index}`}>
                <div>{parseIdToDisplay(t, id)}</div>
                <div>
                    <ol type='a'>
                        {changes.map((change) => (
                            <li key={change.id}>{parseChange(t, change, !displayFullTextOnly && showOnlyDifference)}</li>
                        ))}
                    </ol>
                </div>
            </div>
        );
    });

    const headerActions = displayFullTextOnly ? null : (
        <>
            <center>
                <Switch
                    checkedChildren={t('Only display differences')}
                    unCheckedChildren={t('Show full text')}
                    checked={showOnlyDifference}
                    onChange={setShowOnlyDifference}
                />
            </center>
            <hr />
        </>
    );

    return (
        <div>
            {headerActions}
            {renderedChanges}
        </div>
    );
};

const parseChange = (t: Translator, entry: Changelog, showOnlyDifference: boolean) => {
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

    if (showOnlyDifference) {
        return `${id} ${t('of the law shall be')}: ${parseTextChanges(entry.changes)}`;
    } else {
        return (
            <>
                {id} {t('of the law shall be')}: {embedChangesToText(entry.changes)}
            </>
        );
    }

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

const parseTextChanges = (changes: Changelog['changes']) => {
    if (!changes) {
        return '';
    }

    return changes
        .filter(([type]) => type !== 0)
        .map(([type, text]) => {
            if (type === -1) {
                return `-${text}`;
            }

            if (type === 1) {
                return `+${text}`;
            }

            return '';
        })
        .join(' ');
};

export default LawChanges;
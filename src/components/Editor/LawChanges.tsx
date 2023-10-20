import { FC, useState } from 'react';
import Changelog from '../../models/Changelog';
import parseIdToDisplay from './utils/changelog/parseidToDisplay';
import { Switch, Typography } from 'antd';

const { Text } = Typography;

interface Props {
    changelog: Changelog[];
}

const LawChanges: FC<Props> = ({ changelog }) => {
    const [showOnlyDifference, setShowOnlyDifference] = useState(true);

    if (changelog.length === 0) {
        return (
            <span>No changes</span>
        );
    }

    const changes = changelog.map((change, index) => (
        <div key={`${change.id}-${index}`}>
            <center>{index + 1}. gr.</center>
            <div>{parseChange(change, showOnlyDifference)}</div>
        </div>
    ));

    return (
        <div>
            <center>
                <Switch
                    checkedChildren="Only display difference"
                    unCheckedChildren="Show full text"
                    checked={showOnlyDifference}
                    onChange={setShowOnlyDifference}
                />
            </center>
            <hr />
            {changes}
        </div>
    );
};

const parseChange = (entry: Changelog, showOnlyDifference: boolean) => {
    const id = parseIdToDisplay(entry.id);

    if (entry.type === 'add') {
        return `${id} of the law was added: ${entry.text}`;
    }

    if (entry.type === 'delete') {
        return `${id} of the law was removed.`;
    }

    if (entry.type === 'change') {
        if (!entry.changes) {
            return `${id} of the law shall be: ${entry.text}`;
        }
        
        if (showOnlyDifference ) {
            return `${id} of the law shall be: ${parseTextChanges(entry.changes)}`;
        } else {
            return (
                <>
                    {id} of the law shall be: {embedChangesToText(entry.changes)}
                </>
            );
        }

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
import { Button, Checkbox, Divider, Radio, Space } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { Node, Path } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { getAllowedTagChildren } from '../../../config/tags';
import { MetaType } from '../Slate';
import createLawList from '../actions/createLawList';
import findListItemAtSelection from '../utils/slate/findListItemAtSelection';
import getListItemHierarchy from '../utils/slate/getListItemHierarchy';
import getListItemTitle from '../utils/slate/getListItemTitle';
import getParentListItem from '../utils/slate/getParentListItem';
import isListItemWithMeta from '../utils/slate/isListItemWithMeta';
import useLanguageContext from '../../App/useLanguageContext';

interface Props {
    onSubmit: () => void;
    onCancel: () => void;
}

const AddEntryForm: FC<Props> = ({ onCancel, onSubmit }) => {
    const { t } = useLanguageContext();
    const editor = useSlateStatic();
    const [bumpVersionNumber, setBumpVersionNumber] = useState(true);
    const [type, setType] = useState<MetaType | null>(null);
    const [listItem, listItemPath] = useMemo(() => findListItemAtSelection(editor) ?? [], [editor]);
    const [locationToAdd, setLocationToAdd] = useState<'nested-list' | string>(JSON.stringify(listItemPath ?? []));

    if (!listItem || !listItemPath || !isListItemWithMeta(listItem)) {
        throw new Error('Can not find list item in selection');
    }

    const handleSubmit = () => {
        if (!type) {
            throw new Error('No type selected');
        }

        onSubmit();
        ReactEditor.focus(editor);

        const nested = locationToAdd === 'nested-list';
        const location = nested ? listItemPath : JSON.parse(locationToAdd) as Path;
        createLawList(editor, type, location, { nested, bumpVersionNumber });
    };

    const hierarchyOptions = useMemo(() => {
        const hierarchy = getListItemHierarchy(editor, listItemPath);

        return hierarchy.map(([listItem, path], index) => {
            return (
                <Radio
                    value={JSON.stringify(path)}
                    key={index}
                >
                    {getListItemTitle(editor, path) || (listItem.meta?.type ? t(listItem.meta.type) : 'N/A')}
                </Radio>
            );
        });
    }, [editor, listItemPath, t]);

    const typeOptions = useMemo(() => {
        if (!locationToAdd) {
            return [];
        }

        const isNested = locationToAdd === 'nested-list';
        const [parent] = isNested
            ? [listItem, listItemPath]
            : getParentListItem(editor, JSON.parse(locationToAdd) as Path) ?? [];

        if (parent) {
            return getAllowedTagChildren(parent.meta.type);
        }

        if (!isNested) {
            const path = JSON.parse(locationToAdd) as Path;
            const sibling = Node.get(editor, path);
            
            if (isListItemWithMeta(sibling)) {
                return [sibling.meta.type];
            }
        }

        return [];
    }, [editor, listItem, listItemPath, locationToAdd]);

    const typeButtons = useMemo(() => {
        return typeOptions.map((type) => {
            const title = type.charAt(0).toUpperCase() + type.slice(1);

            return (
                <Radio
                    value={type}
                    key={type}
                    checked={typeOptions.length === 1}
                >
                    {title}
                </Radio>
            );
        });
    }, [typeOptions]);

    useEffect(() => {
        if (typeOptions.length > 0) {
            setType(typeOptions[0]);
        } else {
            setType(null);
        }
    }, [typeOptions]);

    const nestedOption = useMemo(() => {
        if (getAllowedTagChildren(listItem.meta.type).length === 0) {
            return null;
        }

        return (
            <>
                <p style={{ fontSize: '14px' }}>{t('Or')}</p>
                <Radio value='nested-list'> {t('as a nested child')}</Radio>
            </>
        );
    }, [listItem.meta.type, t]);

    return (
        <>
            <p>{t('A new entry will be inserted as sibling of')}:</p>
            <Radio.Group name='add' value={locationToAdd} onChange={(event) => setLocationToAdd(event.target.value)}>
                {hierarchyOptions}
                {nestedOption}
            </Radio.Group>
            <br />
            <br />
            <Radio.Group optionType="button" name='type' value={type} onChange={(event) => setType(event.target.value)}>
                {typeButtons}
            </Radio.Group>
            <Divider />
            <Checkbox checked={bumpVersionNumber} onChange={(event) => setBumpVersionNumber(event.target.checked)}>
                {t('Increase following chapters nr attribute and title?')}
            </Checkbox>
            <Divider />
            <Space direction="horizontal" style={{ float: 'right' }}>
                <Button onClick={onCancel}>{t('Cancel')}</Button>
                <Button type="primary" autoFocus onClick={handleSubmit}>{t('Add')}</Button>
            </Space>
        </>
    );
};

export default AddEntryForm;
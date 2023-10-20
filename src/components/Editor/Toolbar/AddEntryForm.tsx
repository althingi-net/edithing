import { Radio, Divider, Checkbox, Space, Button } from 'antd';
import { MetaType } from '../Slate';
import getListItemTitle from '../utils/slate/getListItemTitle';
import { FC, useMemo, useState } from 'react';
import { useSlateStatic, ReactEditor } from 'slate-react';
import { log } from '../../../logger';
import createLawList from '../actions/createLawList';
import findListItemAtSelection from '../utils/slate/findListItemAtSelection';
import getListItemHierarchy from '../utils/slate/getListItemHierarchy';
import { Path } from 'slate';

interface Props {
    onSubmit: () => void;
    onCancel: () => void;
}

const AddEntryForm: FC<Props> = ({ onCancel, onSubmit }) => {
    const editor = useSlateStatic();
    const [bumpVersionNumber, setBumpVersionNumber] = useState(true);
    const [type, setType] = useState<MetaType>(MetaType.CHAPTER);
    const listItem = useMemo(() => findListItemAtSelection(editor), [editor]);
    const [locationToAdd, setLocationToAdd] = useState<'nested-list' | string>(JSON.stringify(listItem?.[1] ?? []));

    if (!listItem) {
        throw new Error('Can not find list item in selection');
    }

    const handleSubmit = () => {
        onSubmit();
        ReactEditor.focus(editor);

        const nested = locationToAdd === 'nested-list';
        const location = nested ? listItem[1] : JSON.parse(locationToAdd) as Path;
        log('Adding new chapter at', location, { bumpVersionNumber, nested });
        createLawList(editor, MetaType.CHAPTER, location, { nested, bumpVersionNumber });
    };

    const hierarchyOptions = useMemo(() => {
        const hierarchy = getListItemHierarchy(editor, listItem[1]);

        return hierarchy.map(([listItem, path], index) => {
            return (
                <Radio
                    value={JSON.stringify(path)}
                    key={index}
                >
                    {getListItemTitle(editor, path) || listItem.meta?.type}
                </Radio>
            );
        });
    }, [editor, listItem]);

    return (
        <>
            <Radio.Group optionType="button" name='type' value={type} onChange={(event) => setType(event.target.value)}>
                <Radio.Button value={MetaType.CHAPTER}>Chapter</Radio.Button>
                <Radio.Button value={MetaType.ART}>Article</Radio.Button>
                <Radio.Button value={MetaType.SUBART}>Sub article</Radio.Button>
                <Radio.Button value={MetaType.NUMART}>Numart</Radio.Button>
            </Radio.Group>
            <p>A new entry will be inserted as sibling of:</p>
            <Radio.Group name='add' value={locationToAdd} onChange={(event) => setLocationToAdd(event.target.value)}>
                {hierarchyOptions}
                <p style={{ fontSize: '14px' }}>Or</p>
                <Radio value='nested-list'> as a nested child</Radio>
            </Radio.Group>
            <Divider />
            <Checkbox checked={bumpVersionNumber} onChange={(event) => setBumpVersionNumber(event.target.checked)}>
                Increase following chapters nr attribute and title?
            </Checkbox>
            <Divider />
            <Space direction="horizontal" style={{ float: 'right' }}>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="primary" onClick={handleSubmit}>Add</Button>
            </Space>
        </>
    );
};

export default AddEntryForm;
import { Button, Checkbox, Divider, Modal, Radio, Space } from "antd";
import { useState } from "react";
import { Path } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import { error, log } from "../../logger";
import { MetaType } from "./Slate";
import createLawList from "./actions/createLawList";
import findListItemAtSelection from "./utils/slate/findListItemAtSelection";
import getListItemHierarchy from "./utils/slate/getListItemHierarchy";

const Toolbar = () => {
    const editor = useSlateStatic();
    const [modal, contextHolder] = Modal.useModal();
    const [bumpVersionNumber, setBumpVersionNumber] = useState(true);
    const [locationToAdd, setLocationToAdd] = useState<'nested-list' | Path>();
    const [type, setType] = useState<MetaType>(MetaType.CHAPTER);

    const handleChapterClick: React.MouseEventHandler<HTMLElement> = async (event) => {
        const listItem = findListItemAtSelection(editor);

        if (!listItem) {
            throw new Error('Can not find list item in selection');
        }
        const hierarchy = getListItemHierarchy(editor, listItem[1])

        const confirm = await modal.confirm({
            title: 'Add new Entry',
            width: '500px',
            content: (
                <div>
                    <Radio.Group optionType="button" name='type' defaultValue={type} onChange={(event) => setType(event.target.value)}>
                        <Radio.Button value={MetaType.CHAPTER}>Chapter</Radio.Button>
                        <Radio.Button value={MetaType.ART}>Article</Radio.Button>
                        <Radio.Button value={MetaType.SUBART}>Sub article</Radio.Button>
                        <Radio.Button value={MetaType.NUMART}>Numart</Radio.Button>
                    </Radio.Group>
                    <p>A new entry will be inserted as sibling of:</p>
                    <Radio.Group name='add' onChange={(event) => setLocationToAdd(event.target.value)}>
                        {hierarchy.map(([listItem, path]) => (
                            <Radio value={path}>{listItem.meta?.title ?? listItem.meta?.type}</Radio>
                        ))}
                        <p style={{ fontSize: '14px' }}>Or</p>
                        <Radio value='nested-list'> as a nested child</Radio>
                    </Radio.Group>
                    <Divider />
                    <Checkbox defaultChecked={bumpVersionNumber} onChange={(event) => {
                        setBumpVersionNumber(event.target.checked)
                    }}>
                        Increase following chapters nr attribute and title?
                    </Checkbox>
                </div>
            ),
        })

        setTimeout(() => {
            if (!editor.selection) {
                error('Please put the cursor at the desired location in the text.');
                return;
            }

            if (confirm && editor.selection) {
                ReactEditor.focus(editor);
                log('Adding new chapter at', locationToAdd, { bumpVersionNumber });

                const nested = locationToAdd === 'nested-list';
                const location = nested ? listItem[1] : locationToAdd;
                if (location) {
                    createLawList(editor, MetaType.CHAPTER, location, { nested, bumpVersionNumber })
                }
            }
        }, 500)
    }

    return (
        <Space direction="horizontal" style={{ justifyContent: 'center', marginBottom: '10px', width: '100%' }}>
            <Button type="primary" onClick={handleChapterClick} key='cha'>
                Add Entry
            </Button>
            {contextHolder}
        </Space>
    )
}

export default Toolbar;
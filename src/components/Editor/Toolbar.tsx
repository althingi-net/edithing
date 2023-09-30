import { Button, Checkbox, Modal, Space } from "antd";
import { useState } from "react";
import { useSlateStatic } from "slate-react";
import { MetaType } from "./Slate";
import createLawList from "./actions/createLawList";


const Toolbar = () => {
    const editor = useSlateStatic();
    const [modal, contextHolder] = Modal.useModal();
    const [bumpVersionNumber, setBumpVersionNumber] = useState(true);
    console.log('bumpVersionNumber', bumpVersionNumber)

    const handleChapterClick = async () => {

        const confirm = await modal.confirm({
            title: 'Add new Chapter',
            content: (
                <div>
                    <p>A new chapter will be inserted after the current cursor!</p>
                    <Checkbox defaultChecked={bumpVersionNumber} onChange={(event) => {
                        console.log('event', event)
                        setBumpVersionNumber(event.target.checked)
                    }}>
                        Increase following chapters nr attribute and title?
                    </Checkbox>
                </div>
            ),
        })


        if (!editor.selection) {
            console.error('Please put the cursor at the desired location in the text.');
            return;
        }

        if (confirm && editor.selection) {
            createLawList(editor, MetaType.CHAPTER, bumpVersionNumber)
        }

        console.log('res', confirm)
    }

    const handleArtClick = () => {
    }

    const handleSubartClick = () => {
    }

    const handleSenClick = () => {
    }


    return (
        <Space direction="horizontal" style={{ justifyContent: 'center', marginBottom: '10px', width: '100%' }}>
            <Button type="primary" onClick={handleChapterClick} key='cha'>
                CHA
            </Button>
            <Button type="primary" onClick={handleArtClick} key='art'>
                ART
            </Button>
            <Button type="primary" onClick={handleSubartClick} key='subart'>
                SUBART
            </Button>
            <Button type="primary" onClick={handleSenClick} key='sen'>
                SEN
            </Button>
            {contextHolder}
        </Space>
    )
}

export default Toolbar;
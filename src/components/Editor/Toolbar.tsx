import { Button, Checkbox, Modal, Space } from "antd";
import { useState } from "react";
import { ReactEditor, useSlateStatic } from "slate-react";
import { MetaType } from "./Slate";
import createLawList from "./actions/createLawList";
import { error } from "../../logger";


const Toolbar = () => {
    const editor = useSlateStatic();
    const [modal, contextHolder] = Modal.useModal();
    const [bumpVersionNumber, setBumpVersionNumber] = useState(true);

    const handleChapterClick: React.MouseEventHandler<HTMLElement> = async (event) => {
        const confirm = await modal.confirm({
            title: 'Add new Chapter',
            content: (
                <div>
                    <p>A new chapter will be inserted after the current cursor!</p>
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
                createLawList(editor, MetaType.CHAPTER, bumpVersionNumber)
            }
        }, 500)
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
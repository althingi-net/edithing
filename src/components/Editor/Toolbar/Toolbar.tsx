import { Button, Checkbox, Space } from "antd";
import { Text, Transforms } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import useAddEntryButton from "./useAddEntryButton";
import useHighlightContext from "./useHighlightContext";
import setTitle from "../actions/setTitle";
import setName from "../actions/setName";

const Toolbar = () => {
    const editor = useSlateStatic();
    const addEntryButton = useAddEntryButton();
    const highlight = useHighlightContext();
    
    const addTitleMark = () => {
        setTitle(editor);
        ReactEditor.focus(editor);
    };

    const addNameMark = () => {
        setName(editor);
        ReactEditor.focus(editor);
    };

    const addSentenceMark = () => {
        Transforms.setNodes<Text>(editor, { nr: '' }, { match: Text.isText, split: true});
        ReactEditor.focus(editor);
    };

    return (
        <Space direction="horizontal" style={{ justifyContent: 'center', marginBottom: '10px', width: '100%' }}>
            {addEntryButton}
            <Button type="primary" onClick={addTitleMark}>
                Title
            </Button>
            <Button type="primary" onClick={addNameMark}>
                Name
            </Button>
            <Button type="primary" onClick={addSentenceMark}>
                Sentence
            </Button>
            <Checkbox checked={highlight?.isHighlighted} onChange={(event) => highlight?.setHighlighted(event.target.checked)}>
                Highlight sentences
            </Checkbox>
        </Space>
    )
}

export default Toolbar;
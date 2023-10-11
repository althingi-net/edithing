import { Button, Checkbox, Space } from "antd";
import { Text, Transforms } from "slate";
import { useSlateStatic } from "slate-react";
import useAddEntryButton from "./useAddEntryButton";
import useHighlightContext from "./useHighlightContext";

const Toolbar = () => {
    const editor = useSlateStatic();
    const addEntryButton = useAddEntryButton();
    const highlight = useHighlightContext();

    const addNameMark = () => {
        Transforms.setNodes<Text>(editor, { name: true }, { match: Text.isText, split: true });
    };

    const addTitleMark = () => {
        Transforms.setNodes<Text>(editor, { title: true }, { match: Text.isText, split: true });
    };

    const addSentenceMark = () => {
        Transforms.setNodes<Text>(editor, { nr: '' }, { match: Text.isText, split: true });
    };

    return (
        <Space direction="horizontal" style={{ justifyContent: 'center', marginBottom: '10px', width: '100%' }}>
            {addEntryButton}
            <Button type="primary" onClick={addNameMark}>
                Name
            </Button>
            <Button type="primary" onClick={addTitleMark}>
                Title
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
import { Checkbox, Space } from "antd";
import useAddEntryButton from "./useAddEntryButton";
import useHighlightContext from "./useHighlightContext";

const Toolbar = () => {
    const addEntryButton = useAddEntryButton();
    const highlight = useHighlightContext();

    return (
        <Space direction="horizontal" style={{ justifyContent: 'center', marginBottom: '10px', width: '100%' }}>
            {addEntryButton}
            <Checkbox checked={highlight?.isHighlighted} onChange={(event) => highlight?.setHighlighted(event.target.checked)}>
                Highlight sentences
            </Checkbox>
        </Space>
    )
}

export default Toolbar;
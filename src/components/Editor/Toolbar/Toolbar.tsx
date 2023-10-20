import { Checkbox, Space } from 'antd';
import useHighlightContext from './useHighlightContext';

const Toolbar = () => {
    const highlight = useHighlightContext();

    return (
        <Space direction="horizontal" style={{ justifyContent: 'right', marginBottom: '10px', width: '100%' }}>
            <Checkbox checked={highlight?.isHighlighted} onChange={(event) => highlight?.setHighlighted(event.target.checked)}>
                Highlight sentences
            </Checkbox>
        </Space>
    );
};

export default Toolbar;
import { FC } from "react";
import { Node } from "slate";
import { useSlateSelector } from "slate-react";
import { isListItem } from "./Slate";
import { Checkbox, Form, Input, Space } from "antd";
import { NumberOutlined, TagOutlined, ToolOutlined } from "@ant-design/icons";

interface Props {

}

const NodeMetaForm: FC<Props> = () => {
    const listItem = useSlateSelector((state) => {
        if (!state.selection) {
            return null;
        }

        const path = state.selection.anchor.path;

        if (path.length < 3) {
            return null;
        }

        const node = Node.get(state, state.selection.anchor.path.slice(0, -2));
        return isListItem(node) ? node : null;
    });
    const [form] = Form.useForm();

    if (!listItem) {
        return null;
    }

    return (
        <div>
            <Form
                form={form}
                initialValues={listItem.meta}
                layout="vertical"
            >
                <Form.Item label="Type">
                    <Input disabled prefix={<ToolOutlined />} value={listItem.meta.type} />
                </Form.Item>
                <Form.Item label="Title">
                    <Space direction="horizontal">
                        <Checkbox disabled checked={!!listItem.meta.title}>Has title?</Checkbox>
                        {listItem.meta.title && <Input disabled prefix={<TagOutlined />} value={listItem.meta.title} />}
                    </Space>
                </Form.Item>
                <Space direction="horizontal">
                    <Form.Item label="Nr.">
                        <Input disabled prefix={<NumberOutlined />} value={listItem.meta.nr} />
                    </Form.Item>
                    <Form.Item label="Roman Nr.">
                        <Input disabled prefix={<NumberOutlined />} value={listItem.meta.romanNr} />
                    </Form.Item>
                </Space>
            </Form>
        </div>
    )
}

export default NodeMetaForm;
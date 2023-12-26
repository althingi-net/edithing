import { NumberOutlined, TagOutlined, ToolOutlined } from '@ant-design/icons';
import { Checkbox, Form, Input, Space } from 'antd';
import { FC } from 'react';
import { useSlateSelector, useSlateStatic } from 'slate-react';
import useLanguageContext from '../App/useLanguageContext';
import { findListItemAtSelection, getListItemTitle, getListItemName } from 'law-document';

const NodeMetaForm: FC = () => {
    const { t } = useLanguageContext();
    const editor = useSlateStatic();
    const [listItem, path] = useSlateSelector(findListItemAtSelection) ?? [];
    const [form] = Form.useForm();

    if (!listItem || !listItem.meta || !path) {
        return null;
    }

    const { title, name, type, nr, romanNr } = listItem.meta;
    const titleText = getListItemTitle(editor, path);
    const nameText = getListItemName(editor, path);

    return (
        <div>
            <Form
                form={form}
                initialValues={listItem.meta}
                layout="vertical"
            >
                <Form.Item label={t('Type')}>
                    <Input disabled prefix={<ToolOutlined />} value={type} />
                </Form.Item>
                <Form.Item label={t('Title')}>
                    <Space direction="horizontal">
                        <Checkbox disabled checked={title}>{t('Has title?')}</Checkbox>
                        {title && <Input disabled prefix={<TagOutlined />} value={titleText ?? ''} />}
                    </Space>
                </Form.Item>
                <Form.Item label={t('Name')}>
                    <Space direction="horizontal">
                        <Checkbox disabled checked={name}>{t('Has name?')}</Checkbox>
                        {name && <Input disabled prefix={<TagOutlined />} value={nameText} />}
                    </Space>
                </Form.Item>
                <Space direction="horizontal">
                    <Form.Item label={t('Nr.')}>
                        <Input disabled prefix={<NumberOutlined />} value={nr} />
                    </Form.Item>
                    <Form.Item label={t('Roman Nr.')}>
                        <Input disabled prefix={<NumberOutlined />} value={romanNr} />
                    </Form.Item>
                </Space>
            </Form>
        </div>
    );
};

export default NodeMetaForm;
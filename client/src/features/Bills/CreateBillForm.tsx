import { Button, Divider, Form, Input, Space, notification } from 'antd';
import { BillService } from 'client-sdk';
import { FC, useState } from 'react';
import useLanguageContext from '../App/useLanguageContext';
import handleError from '../App/handleError';
import { useStore } from '../App/store/useStore';

interface Props {
    onSubmit: () => void;
    onCancel: () => void;
}

const CreateBillForm: FC<Props> = ({ onCancel, onSubmit }) => {
    const { t } = useLanguageContext();
    const { session } = useStore();
    const [title, setTitle] = useState<string>('');
    const [lagasafnId, setLagasafnId] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [form] = Form.useForm<{ title: string, lagasafnId: number, description: string }>();

    const handleSubmit = () => {
        if (!session) {
            throw new Error('Session not found!');
        }

        BillService.billControllerCreate({
            lagasafnId: Number(lagasafnId),
            title,
            description,
            author: session.user,
        })
            .then(() => {
                onSubmit();
                notification.success({ message: t('Bill created') });
            })
            .catch(handleError);
    };

    return (
        <Form
            form={form}
            onFinish={handleSubmit}
        >
            <Form.Item label={t('Bill Number')}>
                <Input placeholder={t('Bill Number')} value={lagasafnId} onChange={(event) => setLagasafnId(event.target.value)} />
            </Form.Item>

            <Form.Item label={t('Title')}>
                <Input placeholder={t('Title')} value={title} onChange={(event) => setTitle(event.target.value)} />
            </Form.Item>

            <Form.Item label={t('Description')}>
                <Input placeholder={t('Description')} value={description} onChange={(event) => setDescription(event.target.value)} />
            </Form.Item>

            <Divider />

            <Space direction="horizontal" style={{ float: 'right', marginBottom: '-24px' }}>
                <Form.Item>
                    <Button onClick={onCancel}>{t('Cancel')}</Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {t('Add')}
                    </Button>
                </Form.Item>
            </Space>
        </Form>
    );
};

export default CreateBillForm;

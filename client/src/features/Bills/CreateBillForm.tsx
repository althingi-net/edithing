import { Button, Divider, Form, Input, Space, notification } from 'antd';
import { BillService } from 'client-sdk';
import { FC, useState } from 'react';
import useLanguageContext from '../App/useLanguageContext';
import useSessionContext from '../App/useSessionContext';
import handleError from '../App/handleError';

interface Props {
    onSubmit: () => void;
    onCancel: () => void;
}

const CreateBillForm: FC<Props> = ({ onCancel, onSubmit }) => {
    const { t } = useLanguageContext();
    const [title, setTitle] = useState<string>('');
    const { session } = useSessionContext();
    const [form] = Form.useForm<{ title: string }>();

    const handleSubmit = () => {
        if (!session) {
            throw new Error('Session not found!');
        }

        BillService.billControllerCreate({
            title,
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
            <Form.Item label={t('Title')}>
                <Input placeholder={t('Title')} value={title} onChange={(event) => setTitle(event.target.value)} />
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
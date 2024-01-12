import { Button, Divider, Input, Space, notification } from 'antd';
import { BillService } from 'client-sdk';
import { FC, useState } from 'react';
import useLanguageContext from '../App/useLanguageContext';
import useSessionContext from '../App/useSessionContext';

interface Props {
    onSubmit: () => void;
    onCancel: () => void;
}

const AddEntryForm: FC<Props> = ({ onCancel, onSubmit }) => {
    const { t } = useLanguageContext();
    const [title, setTitle] = useState<string>('');
    const { session } = useSessionContext();

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
            .catch((error) => notification.error({ message: error.message }));
    };

    return (
        <>
            <Input placeholder={t('Title')} value={title} onChange={(event) => setTitle(event.target.value)} />
            <Divider />
            <Space direction="horizontal" style={{ float: 'right' }}>
                <Button onClick={onCancel}>{t('Cancel')}</Button>
                <Button type="primary" autoFocus onClick={handleSubmit}>{t('Add')}</Button>
            </Space>
        </>
    );
};

export default AddEntryForm;
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC, useState } from 'react';
import useLanguageContext from '../App/useLanguageContext';
import Modal from '../App/Modal';
import CreateBillForm from './CreateBillForm';

interface Props {
    onSubmit: () => void;
}

const CreateBillButton: FC<Props> = ({ onSubmit }) => {
    const { t } = useLanguageContext();
    const [isOpen, setOpen] = useState(false);
    const onClose = () => {
        setOpen(false);
        onSubmit();
    };

    return (
        <>
            <Button
                size="small"
                onClick={() => setOpen(true)}
            >
                <PlusOutlined /> {t('Create New Bill')}
            </Button>
            <Modal title={t('Add new Entry')} isOpen={isOpen} onClose={onClose}>
                <div>
                    <CreateBillForm onSubmit={onClose} onCancel={onClose} />
                </div>
            </Modal>
        </>
    );
};

export default CreateBillButton;
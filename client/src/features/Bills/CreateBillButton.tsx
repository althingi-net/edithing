import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC, useState } from 'react';
import Modal from '../App/Modal';
import { useTranslation } from '../App/store/useTranslation';
import CreateBillForm from './CreateBillForm';

interface Props {
    onSubmit: () => void;
}

const CreateBillButton: FC<Props> = ({ onSubmit }) => {
    const t = useTranslation();
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
            <Modal title={t('Create New Bill')} isOpen={isOpen} onClose={onClose}>
                <div>
                    <CreateBillForm onSubmit={onClose} onCancel={onClose} />
                </div>
            </Modal>
        </>
    );
};

export default CreateBillButton;

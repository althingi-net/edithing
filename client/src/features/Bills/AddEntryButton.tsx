import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC, useState } from 'react';
import useLanguageContext from '../App/useLanguageContext';
import AddEntryModal from './AddEntryModal';

interface Props {
    onSubmit: () => void;
}

const AddEntryButton: FC<Props> = ({ onSubmit }) => {
    const { t } = useLanguageContext();
    const [isOpen, setOpen] = useState(false);

    return (
        <>
            <AddEntryModal isOpen={isOpen} onClose={() => { setOpen(false); onSubmit(); }} />
            <Button
                size="small"
                onClick={() => setOpen(true)}
            >
                <PlusOutlined /> {t('Create New Bill')}
            </Button>
        </>
    );
};

export default AddEntryButton;
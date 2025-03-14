import { FC } from 'react';
import Modal from '../../App/Modal';
import useLanguageContext from '../../App/useLanguageContext';
import AddEntryForm from './AddEntryForm';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const AddEntryModal: FC<Props> = ({ isOpen, onClose }) => {
    const { t } = useLanguageContext();

    return (
        <Modal title={t('Add new Entry')} isOpen={isOpen} onClose={onClose}>
            <div>
                <AddEntryForm onSubmit={onClose} onCancel={onClose} />
            </div>
        </Modal>
    );
};

export default AddEntryModal;
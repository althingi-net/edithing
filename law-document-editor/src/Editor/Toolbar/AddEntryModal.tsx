import React, { FC } from 'react';
import { Translator } from '../../translations';
import AddEntryForm from './AddEntryForm';
import Modal from '../../Model/Modal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    t: Translator;
}

const AddEntryModal: FC<Props> = ({ isOpen, onClose, t }) => {
    return (
        <Modal title={t('Add new Entry')} isOpen={isOpen} onClose={onClose}>
            <div>
                <AddEntryForm onSubmit={onClose} onCancel={onClose} t={t} />
            </div>
        </Modal>
    );
};

export default AddEntryModal;
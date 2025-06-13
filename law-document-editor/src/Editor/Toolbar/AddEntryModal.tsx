import React, { FC } from 'react';
import { Translator } from '../../translations';
import { Modal } from '../../Model/Modal';
import { AddEntryForm } from './AddEntryForm';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    t: Translator;
}

export const AddEntryModal: FC<Props> = ({ isOpen, onClose, t }) => {
    return (
        <Modal title={t('Add new Entry')} isOpen={isOpen} onClose={onClose}>
            <div>
                <AddEntryForm onSubmit={onClose} onCancel={onClose} t={t} />
            </div>
        </Modal>
    );
};

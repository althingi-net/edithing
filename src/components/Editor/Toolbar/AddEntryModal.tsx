import { FC } from "react";
import Modal from "../../Modal";
import AddEntryForm from "./AddEntryForm";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const AddEntryModal: FC<Props> = ({ isOpen, onClose }) => {
    return (
        <Modal title='Add new Entry' isOpen={isOpen} onClose={onClose}>
            <div>
                <AddEntryForm onSubmit={onClose} onCancel={onClose} />
            </div>
        </Modal>
    );
}

export default AddEntryModal;
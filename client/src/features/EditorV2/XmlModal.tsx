import { Button, Divider, Space } from 'antd';
import { FC, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import Modal from '../App/Modal';
import useLanguageContext from '../App/useLanguageContext';

interface Props {
    isOpen: boolean;
    title: string;
    content?: string;
    editable?: boolean;
    actionTitle?: string;
    onAction?: (content: string) => void;
    onClose: () => void;
}

const XmlModal: FC<Props> = (props) => {
    const { isOpen, title, content, editable, actionTitle, onAction, onClose } = props;
    const { t } = useLanguageContext();
    const [value, setValue] = useState<string>(content ?? '');

    return (
        <Modal title={title} isOpen={isOpen} onClose={onClose}>
            <div>
                <TextArea autoSize value={value} onChange={(event) => setValue(event.target.value)} disabled={!editable} />
                <Divider />
                <Space direction="horizontal" style={{ float: 'right' }}>
                    <Button onClick={onClose}>{t('Cancel')}</Button>
                    <Button type="primary" autoFocus onClick={() => onAction?.(value)}>{actionTitle}</Button>
                </Space>
            </div>
        </Modal>
    );
};

export default XmlModal;
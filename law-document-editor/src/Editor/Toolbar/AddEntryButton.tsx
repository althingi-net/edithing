import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import isHotkey from 'is-hotkey';
import React, { FC, useEffect, useState } from 'react';
import getMetaKey from '../../utils/getMetaKey';
import AddEntryModal from './AddEntryModal';
import { Translator } from '../../translations';

interface Props {
    t: Translator;
}

const AddEntryButton: FC<Props> = ({ t }) => {
    const [isOpen, setOpen] = useState(false);
    const metaKey = getMetaKey();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isHotkey(`${metaKey}+enter`)(event)) {
                setOpen(true);
            }
        };
    
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [metaKey]);

    return (
        <>
            <AddEntryModal t={t} isOpen={isOpen} onClose={() => setOpen(false)} />
            <Tooltip title={<small><i>{metaKey.toUpperCase()} + ENTER</i></small>}>
                <Button
                    style={{ width: '100%', height: '100%' }}
                    size="small"
                    onClick={() => setOpen(true)}
                >
                    <PlusOutlined />
                </Button>
            </Tooltip>
        </>
    );
};

export default AddEntryButton;
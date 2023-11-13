import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { FC, useEffect, useState } from 'react';
import useLanguageContext from '../App/useLanguageContext';

interface Props {
    content?: string | object;
}

const CopyClipboardButton: FC<Props> = ({ content: text }) => {
    const { t } = useLanguageContext();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timeout = setTimeout(() => {
                setCopied(false);
            }, 500);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [copied]);

    if (!text) {
        return null;
    }

    return (
        <Tooltip title={t('Copy content to clipboard')}>
            <Button
                onClick={(event) => {
                    navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
                    setCopied(true);
                    event.stopPropagation();
                }}
                size='small'
                style={{ marginLeft: '8px' }}
            >
                {copied ? <CheckOutlined /> : <CopyOutlined />}
            </Button>
        </Tooltip>
    );
};

export default CopyClipboardButton;
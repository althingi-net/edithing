import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { FC, useEffect, useState } from 'react';
import useLanguageContext from '../App/useLanguageContext';

interface Props {
    content?: string | any[];
    transform?: (content: any[]) => string;
}

const CopyClipboardButton: FC<Props> = ({ content, transform }) => {
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

    if (!content) {
        return null;
    }

    const text = typeof content === 'string' ? content
        : transform ? transform(content)
            : JSON.stringify(content, null, 2);

    return (
        <Tooltip title={t('Copy content to clipboard')}>
            <Button
                onClick={(event) => {
                    void navigator.clipboard.writeText(text);
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
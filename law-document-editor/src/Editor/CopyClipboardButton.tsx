import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { Translator } from '../translations';

interface Props {
    content?: string | any[];
    transform?: (content: any[]) => string;
    t: Translator;
}

export const CopyClipboardButton: FC<Props> = ({ content, transform, t }) => {
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

    return (
        <Tooltip title={t('Copy content to clipboard')}>
            <Button
                onClick={(event) => {
                    const text = typeof content === 'string' ? content
                        : transform ? transform(content)
                            : JSON.stringify(content, null, 2);

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
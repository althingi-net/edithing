import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FC, useEffect, useState } from "react";

interface Props {
    content?: any;
}

const CopyClipboardButton: FC<Props> = ({ content: text }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timeout = setTimeout(() => {
                setCopied(false);
            }, 500);

            return () => {
                clearTimeout(timeout);
            }
        }
    }, [copied]);

    if (!text) {
        return null;
    }

    return (
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
    );
}

export default CopyClipboardButton;
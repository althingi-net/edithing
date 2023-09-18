import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FC, useEffect, useState } from "react";

interface Props {
    text?: string;
}

const CopyClipboardButton: FC<Props> = ({ text }) => {
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
                navigator.clipboard.writeText(text);
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
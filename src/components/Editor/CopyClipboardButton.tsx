import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FC, useState } from "react";

interface Props {
    text?: string;
}

const CopyClipboardButton: FC<Props> = ({ text }) => {
    const [copied, setCopied] = useState(false);

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
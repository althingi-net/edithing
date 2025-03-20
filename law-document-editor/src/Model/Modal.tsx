import { CloseOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import React, { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import Portal from '../utils/Portal';
import './Modal.css';

interface Props extends PropsWithChildren {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

const Modal: FC<Props> = ({ children, isOpen, onClose, title }) => {
    const nodeRef = useRef(null);
    useEffect(() => {
        const closeOnEscapeKey = (event: KeyboardEvent) => event.key === 'Escape' ? onClose() : null;

        document.body.addEventListener('keydown', closeOnEscapeKey);

        return () => {
            document.body.removeEventListener('keydown', closeOnEscapeKey);
        };
    }, [onClose]);

    return (
        <Portal>
            <CSSTransition
                in={isOpen}
                timeout={{ appear: 0, exit: 300 }}
                unmountOnExit
                nodeRef={nodeRef}
                classNames='modal'
            >
                <div
                    className="modal-overlay animation-start"
                    onClick={onClose}
                    role="none"
                    ref={nodeRef}
                >
                    <Card
                        className='modal'
                        onClick={(e) => e.stopPropagation()}
                        title={title}
                        extra={<Button onClick={onClose} size="small"><CloseOutlined /></Button>}
                        styles={{
                            header: { width: '100%' },
                            body: { display: 'flex', flexGrow: 1, width: '100%' },
                        }}
                        role='dialog'
                    >
                        {children}
                    </Card>
                </div>
            </CSSTransition>
        </Portal >
    );
};

export default Modal;
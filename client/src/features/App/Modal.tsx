import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import './Modal.css';
import { CSSTransition } from 'react-transition-group';
import { CloseOutlined } from '@ant-design/icons';
import { Card, Button } from 'antd';
import Portal from './Portal';

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
                <div className="modal-overlay" onClick={onClose} role="none">
                    <Card
                        className='modal'
                        ref={nodeRef}
                        onClick={(e) => e.stopPropagation()}
                        title={title}
                        extra={<Button onClick={onClose} size="small"><CloseOutlined /></Button>}
                        headStyle={{ width: '100%' }}
                        bodyStyle={{ width: '100%', display: 'flex', flexGrow: 1 }}
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
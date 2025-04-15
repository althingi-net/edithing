import { FC, PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';

export const Portal: FC<PropsWithChildren> = ({ children }) => {
    return typeof document === 'object'
        ? ReactDOM.createPortal(children, document.body)
        : null;
};
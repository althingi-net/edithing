import modal from 'antd/es/modal';
import { FC, PropsWithChildren, useEffect } from 'react';
import { useBlocker } from 'react-router';
import { useStore } from './store/useStore';

const BlockNavigation: FC<PropsWithChildren> = ({ children }) => {
    const { isNavigationBlocked, setNavigationBlocked } = useStore();
    const blocker = useBlocker(isNavigationBlocked);

    useEffect(() => {
        if (blocker.state === 'blocked') {
            const instance = modal.confirm({
                title: 'Unsaved Changes',
                content: 'You have unsaved changes, are you sure you want to leave?',
                okText: 'Leave',
                cancelText: 'Stay',
                onOk: () => {
                    blocker.proceed();
                    setNavigationBlocked(false);
                },
                onCancel: () => blocker.reset(),
            });

            return () => {
                blocker.reset();
                instance.destroy();
            };
        }
    }, [blocker, setNavigationBlocked]);

    return <>{children}</>;
};

export default BlockNavigation; 
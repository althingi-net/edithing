import modal from 'antd/es/modal';
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useBlocker } from 'react-router-dom';

interface BlockNavigationType {
    blockNavigation: () => void;
    unblockNavigation: () => void;
    isNavigationBlocked: boolean;
}

export const BlockNavigation = createContext<BlockNavigationType | null>(null);

export const BlockNavigationProvider: FC<PropsWithChildren> = ({ children }) => {
    const [isNavigationBlocked, setBlockNavigation] = useState(false);
    
    const blocker = useBlocker(isNavigationBlocked);

    const blockNavigation = useCallback(() => {
        setBlockNavigation(true);
    }, []);

    const unblockNavigation = useCallback(() => {
        setBlockNavigation(false);
    }, []);

    useEffect(() => {
        if (blocker.state === 'blocked') {
            const instance = modal.confirm({
                title: 'Unsaved Changes',
                content: 'You have unsaved changes, are you sure you want to leave?',
                okText: 'Leave',
                cancelText: 'Stay',
                onOk: () => {
                    blocker.proceed();
                    setBlockNavigation(false);
                },
                onCancel: () => blocker.reset(),
            });

            return () => {
                blocker.reset();
                instance.destroy();
            };
        }
    });

    return (
        <BlockNavigation.Provider value={{ blockNavigation, unblockNavigation, isNavigationBlocked }}>
            {children}
        </BlockNavigation.Provider>
    );
};

const useBlockNavigation = () => {
    const context = useContext(BlockNavigation);

    if (!context) {
        throw new Error('useBlockNavigation must be used within a BlockNavigationProvider');
    }

    return context;
};

export default useBlockNavigation;
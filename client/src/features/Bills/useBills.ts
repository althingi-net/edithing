import { notification } from 'antd';
import { Bill, BillService } from 'client-sdk';
import { useState, useCallback, useEffect } from 'react';
import useSessionContext from '../App/useSessionContext';

const useBills = () => {
    const { isAuthenticated } = useSessionContext();
    const [bills, setBills] = useState<Bill[]>([]);

    const reload = useCallback(() => {
        if (!isAuthenticated()) {
            return;
        }
        BillService.billControllerGetAll()
            .then(setBills)
            .catch((error: Error) => notification.error({ message: error.message }));
    }, [isAuthenticated]);

    useEffect(reload, [reload]);

    return [bills, reload] as const;
};

export default useBills;
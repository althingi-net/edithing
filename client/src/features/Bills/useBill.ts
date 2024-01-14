import { notification } from 'antd';
import { Bill, BillService } from 'client-sdk';
import { useState, useCallback, useEffect } from 'react';
import useSessionContext from '../App/useSessionContext';

const useBill = (id?: string | number) => {
    const { isAuthenticated } = useSessionContext();
    const [bill, setBill] = useState<Bill>();

    const reload = useCallback(() => {
        if (!isAuthenticated() || !id) {
            return;
        }
        
        BillService.billControllerGet(Number(id))
            .then(setBill)
            .catch((error: Error) => notification.error({ message: error.message }));
    }, [id, isAuthenticated]);

    useEffect(reload, [reload]);

    return [bill, reload] as const;
};

export default useBill;
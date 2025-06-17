import { Bill, BillService } from 'client-sdk';
import { useCallback, useEffect, useState } from 'react';
import handleError from '../App/handleError';
import { useStore } from '../App/store/useStore';

const useBills = () => {
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    const [bills, setBills] = useState<Bill[]>([]);

    const reload = useCallback(() => {
        if (!isAuthenticated()) {
            return;
        }
        BillService.billControllerGetAll()
            .then(setBills)
            .catch(handleError);
    }, [isAuthenticated]);

    useEffect(reload, [reload]);

    return [bills, reload] as const;
};

export default useBills;
import { Bill, BillService } from 'client-sdk';
import { useCallback, useEffect, useState } from 'react';
import handleError from '../App/handleError';
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
            .catch(handleError);
    }, [isAuthenticated]);

    useEffect(reload, [reload]);

    return [bills, reload] as const;
};

export default useBills;
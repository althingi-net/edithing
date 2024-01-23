import { Bill, BillService } from 'client-sdk';
import { useCallback, useEffect, useState } from 'react';
import handleError from '../App/handleError';
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
            .catch(handleError);
    }, [id, isAuthenticated]);

    useEffect(reload, [reload]);

    return [bill, reload] as const;
};

export default useBill;
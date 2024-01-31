import { Bill, BillService } from 'client-sdk';
import { useCallback, useEffect, useState } from 'react';
import handleError from '../App/handleError';
import useSessionContext from '../App/useSessionContext';

const useBill = (id?: string | number) => {
    const { isAuthenticated } = useSessionContext();
    const [bill, setBill] = useState<Bill>();
    const [hasError, setError] = useState(false);

    // reset error when id changes
    useEffect(() => setError(false), [id]);

    const reloadBill = useCallback(() => {
        if (!isAuthenticated() || !id) {
            return;
        }
        
        BillService.billControllerGet(Number(id))
            .then(setBill)
            .catch((error) => {
                handleError(error);
                setError(true);
            });
    }, [id, isAuthenticated]);

    useEffect(reloadBill, [reloadBill]);

    return { bill, reloadBill, hasError };
};

export default useBill;
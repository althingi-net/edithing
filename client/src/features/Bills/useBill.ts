import { Bill, BillService } from 'client-sdk';
import { useCallback, useEffect, useState } from 'react';
import handleError from '../App/handleError';
import { useStore } from '../App/store/useStore';

const useBill = (id?: string | number) => {
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    const [bill, setBill] = useState<Bill>();
    const [hasError, setError] = useState(false);

    // reset error when id changes
    useEffect(() => setError(false), [id]);

    const reloadBill = useCallback(() => {
        if (!isAuthenticated() || !id) {
            return;
        }
        
        BillService.billControllerGet(Number(id))
            .then((bill) => {
                setBill(bill);
                setError(false);
            })
            .catch((error) => {
                handleError(error);
                setError(true);
            });
    }, [id, isAuthenticated]);

    useEffect(reloadBill, [reloadBill]);

    return { bill, reloadBill, hasError };
};

export default useBill;

import { useState, useEffect } from 'react';

const useDebounce = <T>(value: T, timeout: number) => {
    const [state, setState] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => setState(value), timeout);

        return () => clearTimeout(handler);
    }, [value, timeout]);

    return state;
};

export default useDebounce;
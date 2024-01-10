
export const log = (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_DEBUG === 'true') {
        console.log(message, ...args);
    }
};

export const error = (message: string, ...args: unknown[]) => {
    console.error(message, ...args);
};
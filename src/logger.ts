export const log = (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(message, ...args);
    }
}

export const error = (message: string, ...args: any[]) => {
    console.error(message, ...args);
}
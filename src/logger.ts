export const log = (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(message, ...args);
    }
}

export const error = (message: string, ...args: any[]) => {
    console.error(message, ...args);
}
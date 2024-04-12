export const waitFor = (condition: () => Promise<boolean>) => {
    return new Promise<void>((resolve) => {
        setTimeout(async () => {

            if (await condition()) {
                resolve();
            } else {
                resolve(waitFor(condition));
            }
        }, 300);
    });
};

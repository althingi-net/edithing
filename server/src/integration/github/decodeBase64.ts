const decodeBase64 = (base64: string) => {
    return Buffer.from(base64, 'base64').toString('utf-8');
};

export default decodeBase64;
import fixBase64Decode from './fixBase64Decode';

const decodeBase64 = (base64: string) => {
    return fixBase64Decode(atob(base64));
};

export default decodeBase64;
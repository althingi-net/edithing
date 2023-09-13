
/**
 * Takes the result from atob() and converts it to bytes and then to a string to fix unicode issues
 * @param data The base64 decoded string with unicode issues
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
 * @example fixBase64Decode(atob('VGhpcyBpcyBhIHRlc3Q=')) // 'This is a test'
 */
const fixBase64Decode = (data: string) => {
    const bytes = Uint8Array.from(data, (m) => m.codePointAt(0) as number);
    return new TextDecoder().decode(bytes);
}

export default fixBase64Decode;
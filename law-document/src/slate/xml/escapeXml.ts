export const escapeXml = (text: string, isAttribute = false): string => {
    let newText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    if (isAttribute) {
        newText = newText
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    return newText;
};
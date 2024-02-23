const getTextSize = (text: string) => {
    const element = document.createElement('canvas');
    const context = element.getContext('2d');
    // context.font = font;

    if (!context) {
        return { width: 0, height: 0 };
    }

    const size = {
        'width': context.measureText(text).width,
        'height': parseInt(context.font)
    };

    return size;
};

export default getTextSize;
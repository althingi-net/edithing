const getMetaKey = () => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    if (isMac) {
        return 'cmd';
    } else {
        return 'ctrl';
    }
};

export default getMetaKey;
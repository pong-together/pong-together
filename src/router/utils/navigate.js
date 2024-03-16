/**
 * @param  { string } to
 * @param  { boolean } isReplace
 */
 export const navigate = (to, isReplace = false) => {
    if (location.pathname !== to) {
        const historyChangeEvent = new CustomEvent('historychange', {
            detail: {
                to,
                isReplace,
            },
        });

        dispatchEvent(historyChangeEvent);
    }
};

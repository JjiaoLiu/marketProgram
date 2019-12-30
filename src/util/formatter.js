export const dateFormatter = (value) => {
    if (!value) return '';
    var re = /(\d{4})-(\d{2})-(\d{2})/;
    return value.replace(re, "$2-$3");
};

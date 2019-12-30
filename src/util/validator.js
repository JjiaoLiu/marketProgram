export const checkPhone = (value) => {
    if (!value) return '';
    let reg = /^1[3-9]\d{9}/;
    if (reg.test(value)) {
        return ''
    }
    return '手机号格式不正确'
};

export const checkRequire = (value) => {
    if (!value)
        return '必填项';
    return ''
};

export const checkNumber = (value) => {
    if (!value) return '';
    if (!/^[1-9]+\d*$/.test(value)) {
        return '必须填整数'
    }
};
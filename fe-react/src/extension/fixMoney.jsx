export const fixMoney = (input) => {
    var res = input ? input : 0
    return res.toLocaleString('vn-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    });
}
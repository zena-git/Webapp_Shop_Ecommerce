export const baseUrl = 'http://localhost:8080/api/v1'
export const baseUrlV3 = 'http://localhost:8080/api/v3'
export function makeid() {
    let length = 6;
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

export const regex = /^(0[0-9]{9}|84[0-9]{9})$/;
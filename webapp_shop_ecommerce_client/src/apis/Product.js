import axiosIns from "../plugin/axios"

export const productApis = {
    async getProduct(page, size) {
        return axiosIns.get('/api/v2/product?page=' + page + "&size=" + size)
    },
    async getProductOne(id) {
        return axiosIns.get('/api/v2/product/' + id)
    }

}
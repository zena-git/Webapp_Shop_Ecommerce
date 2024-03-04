import axiosIns from "../plugin/axios"

export const productApis = {
    async getProduct(page, size) {
        return axiosIns.get('/api/v1/product?page=' + page + "&size=" + size)
    }

}
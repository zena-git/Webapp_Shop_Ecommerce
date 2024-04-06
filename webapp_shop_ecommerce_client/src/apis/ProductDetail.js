import axiosIns from "../plugin/axios"

const BASE_URL = '/api/v1'; 

export const productDetailApis = {
    async findById(id) {
        try {
            const response = await axiosIns.get(`${BASE_URL}/productDetail/${id}`);
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error('Error fetching product detail:', error);
            throw error; // Xử lý lỗi nếu có
        }
    }

}
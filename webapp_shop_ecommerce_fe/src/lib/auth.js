import axios from 'axios'
const AxiosIns = axios.create({
    baseURL: 'http://localhost:8080/api/'
})

AxiosIns.interceptors.response.use(
    (response) => {
        const token = localStorage.getItem("token");
      if (token) {
        response.headers.Authorization = `Bearer ${token}`;
      }
        return response
    },
    function (error) {
        return Promise.reject(error)
    }
)


export default AxiosIns
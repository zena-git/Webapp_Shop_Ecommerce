import axios from "axios";

const backendUrl = "http://localhost:8080";
const axiosIns = axios.create({
    // You can add your headers here
    // ================================
    baseURL: backendUrl,
    timeout: 100000,
    headers: { 'X-Custom-Header': 'foobar' }
})


// ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
axiosIns.interceptors.request.use(config => {
    //     Retrieve token from localStorage
    const token = localStorage.getItem('token')

    //     If token is found
    if (token) {
        // Get request headers and if headers is undefined assign blank object
        config.headers = config.headers || {}

        // Set authorization header
        // ℹ️ JSON.parse will convert token to string
        config.headers.Authorization = token ? `Bearer ${token}` : ''
    }

        // Return modified config
    return config
})

// axiosIns.interceptors.response.use(
//     (response) => {
//         const token = localStorage.getItem("token");
//         console.log(token);
//       if (token) {
//         response.headers.Authorization = `Bearer ${token}`;
//       }
//         return response.data
//     },
//     function (error) {
//         return Promise.reject(error)
//     }
// )

// ℹ️ Add response interceptor to handle 403 response
axiosIns.interceptors.response.use(response => {
    return response
}, error => {
    console.log(error);
    // Handle error
    if (error.response.status === 403) {
        // ℹ️ Logout user and redirect to login page
        // Remove "userData" from localStorage
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        window.location.href = process.env.REACT_APP_FRONTEND_URL + "login";
    }
    else {
        console.log(error);
        return Promise.reject(error)
    }
})
export default axiosIns


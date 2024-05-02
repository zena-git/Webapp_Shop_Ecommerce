import axios from 'axios'
const AxiosIns = axios.create({
  baseURL: 'http://localhost:8080/api/'
})

AxiosIns.interceptors.request.use(config => {
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


export default AxiosIns
import axios from 'axios'

// 这里取决于登录的时候将 token 存储在哪里
const token = localStorage.getItem('token')

const instance = axios.create({
  timeout: 5000,
  // baseURL: 'http://127.0.0.1:8001/',
})

// 设置post请求头
instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    // 将 token 添加到请求头
    token && (config.headers.Authorization = token)
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    if (response.status === 200 && response.statusText === 'OK') {
      const { authorization } = response.headers
      try {
        localStorage.setItem('token', JSON.stringify(authorization))
      } catch (error) {
        console.log(`authorization store error`, error)
      }
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    // 相应错误处理
    // 比如： token 过期， 无权限访问， 路径不存在， 服务器问题等
    switch (error.response.status) {
      case 401:
        break
      case 403:
        break
      case 404:
        break
      case 500:
        break
      default:
        error.message = '其他错误信息'
    }
    return Promise.reject(error)
  },
)

export default instance

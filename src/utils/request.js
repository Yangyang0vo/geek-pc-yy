import { message } from 'antd'
import axios from 'axios'
import { getToken, hasToken, removeToken } from './storage'
import history from 'utils/history'
export const baseURL = 'http://geek.itheima.net/v1_0'
const instance = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (hasToken()) {
      config.headers.Authorization = `Bearer ${getToken()}`
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response.data
  },
  function (error) {
    // 对响应错误做点什么
    if (!error.response) {
      message.error('网络异常', 0.5)
      return Promise.reject('网络错误')
    }
    if (error && error.response.status === 401) {
      removeToken()
      message.warning('身份验证过期,请重新登录', 1, () => {
        history.push('/login', { msg: 401 })
        history.go()
      })
    }
    return Promise.reject(error)
  }
)
export default instance

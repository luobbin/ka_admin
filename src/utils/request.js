import axios from 'axios'
import { Message,MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
    config.headers['Authorization'] = getToken()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => response,
  error => {
    const res = error.response
    if (res!=undefined && typeof(res.status)!=undefined) {
      //Token 过期了;
      if (res.status === 407||res.status === 403) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }else if (res.status === 401 && res.data.error=='您没有操作权限') {
        location.href = '/404'
      }else {
        Message({
          message: res.data.error,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject('error')
    }

    //console.log('err' + error) // for debug
    Message({
      message: "加载超时，请稍后再试",
      type: 'error',
      duration: 5 * 1000
    })
    // store.dispatch('FedLogOut').then(() => {
    //   location.reload() // 为了重新实例化vue-router对象 避免bug
    // })
    return Promise.reject(error)
  })

export default service

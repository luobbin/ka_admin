import request from '@/utils/request'

export function loginByName(name, password) {
  const data = {
    name,
    password
  }
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/me',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

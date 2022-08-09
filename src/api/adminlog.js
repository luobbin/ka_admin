import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/adminlogs',
    method: 'get',
    params
  })
}

//获取指定角色所有权限
export function getRoles(id) {
  return request({
    url: '/adminlogs/'+id+'/edit',
    method: 'get',
    params: { id }
  })
}

//获取所有权限
export function getAllRoles() {
  return request({
    url: '/adminlogs/create',
    method: 'get'
  })
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
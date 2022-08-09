import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/permissions',
    method: 'get',
    params
  })
}

//这个用不到
export function getDetail(id) {
  return request({
    url: '/permissions',
    method: 'get',
    params: { id }
  })
}

export function createData(data) {
  return request({
    url: '/permissions',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/permissions/'+data.id,
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/permissions/'+data.id,
    method: 'delete',
    data
  })
}
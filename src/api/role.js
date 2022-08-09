import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/roles',
    method: 'get',
    params
  })
}

//获取指定角色所有权限
export function getPermissions(id) {
  return request({
    url: '/roles/'+id+'/edit',
    method: 'get',
    params: { id }
  })
}

//获取所有权限
export function getAllPermissions() {
  return request({
    url: '/roles/create',
    method: 'get'
  })
}

export function createData(data) {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

export function updateData(data,id) {
  return request({
    url: '/roles/'+id,
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/roles/'+data.id,
    method: 'delete',
    data
  })
}
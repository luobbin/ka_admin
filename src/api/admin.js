import request from '@/utils/request'

//获取列表数据
export function getList(params) {
  return request({
    url: '/admin_handle',
    method: 'get',
    params
  })
}

//获取指定角色所有权限
export function getRoles(id) {
  return request({
    url: '/admin_handle/'+id+'/edit',
    method: 'get',
    params: { id }
  })
}

//获取所有权限
export function getAllRoles() {
  return request({
    url: '/admin_handle/create',
    method: 'get'
  })
}

export function createData(data) {
  return request({
    url: '/admin_handle',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/admin_handle/'+data.id,
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/admin_handle/'+data.id,
    method: 'delete',
    data
  })
}

export function passwordData(data) {
  return request({
    url: '/admins/update',
    method: 'post',
    data
  })
}
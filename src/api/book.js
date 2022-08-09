import request from '@/utils/requestOther'

//获取列表数据
export function getList(params) {
  return request({
    url: '/noticebook',
    method: 'get',
    params
  })
}

//获取部门
export function getDepartments() {
  return request({
    url: '/department?filter=id;title',
    method: 'get'
  })
}

export function createData(data) {
  return request({
    url: '/noticebook',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/noticebook/'+data.id,
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/noticebook/'+data.id,
    method: 'delete',
    data
  })
}
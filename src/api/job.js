import request from '@/utils/request'

//获取列表数据
export function getList(params) {
  return request({
    url: '/job',
    method: 'get',
    params
  })
}

export function fetchData(id) {
  return request({
    url: '/job/'+id,
    method: 'get'
  })
}

export function createData(data) {
  return request({
    url: '/job',
    method: 'post',
    data
  })
}

//更新数据
export function updateData(params,ids) {
  return request({
    url: '/job/'+ids,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/job/'+ids,
    method: 'delete'
  })
}

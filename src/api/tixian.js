import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/tixians',
    method: 'get',
    params
  })
}

//添加数据
export function createData(data) {
  return request({
    url: '/tixians',
    method: 'post',
    data
  })
}

//更新数据
export function updateData(params,ids) {
  return request({
    url: '/tixians/'+ids,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/tixians/'+ids,
    method: 'delete'
  })
}


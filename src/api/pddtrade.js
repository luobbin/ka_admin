import request from '@/utils/requestTrade'

export function getList(params) {
  return request({
    url: '/pddtrades',
    method: 'get',
    params
  })
}

//添加数据
export function createData(data) {
  return request({
    url: '/pddtrades',
    method: 'post',
    data
  })
}

//更新数据
export function updateData(params,id) {
  return request({
    url: '/pddtrades/'+id,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/pddtrades/'+ids,
    method: 'delete'
  })
}


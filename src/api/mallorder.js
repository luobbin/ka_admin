import request from '@/utils/requestTrade'

export function getList(params) {
  return request({
    url: '/mall_orders',
    method: 'get',
    params
  })
}

//商城列表
export function getMalls() {
  return request({
    url: '/mall_orders/create',
    method: 'get'
  })
}

//添加数据
export function createData(data) {
  return request({
    url: '/mall_orders',
    method: 'post',
    data
  })
}

//更新数据
export function updateData(params,ids) {
  return request({
    url: '/mall_orders/'+ids,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/mall_orders/'+ids,
    method: 'delete'
  })
}


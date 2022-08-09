import request from '@/utils/requestTrade'

export function getList(params) {
  return request({
    url: '/goods_type',
    method: 'get',
    params
  })
}

//获取所有分类
export function getAllCates() {
  return request({
    url: '/goods_type/create',
    method: 'get'
  })
}

export function createData(data) {
  return request({
    url: '/goods_type',
    method: 'post',
    data
  })
}


//更新数据
export function updateData(params,ids) {
  return request({
    url: '/goods_type/'+ids,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/goods_type/'+ids,
    method: 'delete'
  })
}
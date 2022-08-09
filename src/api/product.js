import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/product',
    method: 'get',
    params
  })
}

//获取所有分类
export function getCates() {
  return request({
    url: '/product_cate/create',
    method: 'get'
  })
}


export function fetchData(id) {
  return request({
    url: '/product/'+id,
    method: 'get'
  })
}


export function createData(data) {
  return request({
    url: '/product',
    method: 'post',
    data
  })
}

//更新数据
export function updateData(params,ids) {
  return request({
    url: '/product/'+ids,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/product/'+ids,
    method: 'delete'
  })
}

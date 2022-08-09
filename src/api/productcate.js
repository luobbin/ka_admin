import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/product_cate',
    method: 'get',
    params
  })
}

//获取所有分类
export function getAllCates() {
  return request({
    url: '/product_cate/create',
    method: 'get'
  })
}

export function createData(data) {
  return request({
    url: '/product_cate',
    method: 'post',
    data
  })
}

export function fetchData(id) {
  return request({
    url: '/product_cate/'+id,
    method: 'get'
  })
}

//更新数据
export function updateData(params,id) {
  return request({
    url: '/product_cate/'+id,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/product_cate/'+ids,
    method: 'delete'
  })
}

import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/article_cate',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/article_cate',
    method: 'post',
    data
  })
}


//更新数据
export function updateData(params,id) {
  return request({
    url: '/article_cate/'+id,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/article_cate/'+ids,
    method: 'delete'
  })
}

import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/article',
    method: 'get',
    params
  })
}

//获取所有文章分类
export function getTypes() {
  var params = {
    page: 1,
    limit: 50,
  }
  return request({
    url: '/article_cate',
    method: 'get',
    params
  })
}

export function fetchData(id) {
  return request({
    url: '/article/'+id,
    method: 'get'
  })
}

export function createData(data) {
  return request({
    url: '/article',
    method: 'post',
    data
  })
}


//更新数据
export function updateData(params,ids) {
  return request({
    url: '/article/'+ids,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/article/'+ids,
    method: 'delete'
  })
}

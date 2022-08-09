import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/webset',
    method: 'get',
    params
  })
}

//获取所有分类
export function getTypes() {
  var params = {
    page: 1,
    limit: 50,
  }
  return request({
    url: '/case_cate',
    method: 'get',
    params
  })
}

export function fetchData(id) {
  return request({
    url: '/webset/'+id,
    method: 'get'
  })
}

export function createData(data) {
  return request({
    url: '/webset',
    method: 'post',
    data
  })
}

//更新数据
export function updateData(params,ids) {
  return request({
    url: '/webset/'+ids,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/webset/'+ids,
    method: 'delete'
  })
}

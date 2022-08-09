import request from '@/utils/requestOther'


//获取列表数据
export function getList(params) {
  return request({
    url: '/banners',
    method: 'get',
    params
  })
}

export function fetchData(id) {
  return request({
    url: '/banners/'+id,
    method: 'get'
  })
}


export function createData(data) {
  return request({
    url: '/banners',
    method: 'post',
    data
  })
}

export function updateData(data,id) {
  return request({
    url: '/banners/'+id,
    method: 'put',
    data
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/banners/'+ids,
    method: 'delete'
  })
}

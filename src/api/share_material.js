import request from '@/utils/requestOther'

export function getList(params) {
  return request({
    url: '/share_material',
    method: 'get',
    params
  })
}

export function fetchData(id) {
  return request({
    url: '/share_material/'+id,
    method: 'get'
  })
}

export function createData(data) {
  return request({
    url: '/share_material',
    method: 'post',
    data
  })
}


//更新数据
export function updateData(params,ids) {
  return request({
    url: '/share_material/'+ids,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/share_material/'+ids,
    method: 'delete'
  })
}
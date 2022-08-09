import request from '@/utils/requestOther'

//获取列表数据
export function getList(params) {
  return request({
    url: '/taopid',
    method: 'get',
    params
  })
}


export function createData(data) {
  return request({
    url: '/taopid',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/taopid/' + data.id,
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    url: '/taopid/' + data,
    method: 'delete',
    data
  })
}
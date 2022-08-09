import request from '@/utils/request'



export function fetchData(id) {
  return request({
    url: '/home/'+id,
    method: 'get'
  })
}

//更新数据
export function updateData(params,id) {
  return request({
    url: '/home/'+id,
    method: 'put',
    params
  })
}

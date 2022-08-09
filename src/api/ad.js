import request from '@/utils/requestOther'

export function getList(params) {
  return request({
    url: '/ads',
    method: 'get',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/ads/'+ids,
    method: 'delete'
  })
}
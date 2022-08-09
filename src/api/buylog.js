import request from '@/utils/requestOther'

export function getList(params) {
  return request({
    url: '/buylog',
    method: 'get',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/buylog/'+ids,
    method: 'delete'
  })
}
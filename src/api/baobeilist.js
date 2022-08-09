import request from '@/utils/request'


export function getList(params) {
  return request({
    url: '/alipay_logs',
    method: 'get',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/alipay_logs/'+ids,
    method: 'delete'
  })
}
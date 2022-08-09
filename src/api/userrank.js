import request from '@/utils/requestOther'

export function getList(params,type) {
  if (type == "undefined") {
    type = 'jifenbao'
  }
  return request({
    url: '/user_ranks/'+type,
    method: 'get',
    params
  })
}

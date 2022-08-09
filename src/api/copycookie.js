import request from '@/utils/requestOther'

//获取列表数据
export function getList(params) {
  return request({
    url: '/copy_cookie',
    method: 'get',
    params
  })
}
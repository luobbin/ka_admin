import request from '@/utils/requestOther'

export function getList(params) {
  return request({
    url: '/statements',
    method: 'get',
    params
  })
}

export function updateData(data) {
  return request({
    url: '/statements/'+data.id+'/edit',
    method: 'get',
    data
  })
}

//获取总数据
export function getDetail() {
  return request({
    url: '/statements/create',
    method: 'get'
  })
}

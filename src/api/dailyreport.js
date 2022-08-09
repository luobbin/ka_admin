import request from '@/utils/requestOther'

export function getList(params) {
  return request({
    url: '/daily_reports',
    method: 'get',
    params
  })
}

//更新统计数据
export function updateData(data) {
  return request({
    url: '/daily_reports/'+data.id+'/edit',
    method: 'get',
    data
  })
}

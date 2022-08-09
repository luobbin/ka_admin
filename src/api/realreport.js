import request from '@/utils/requestOther'

export function getList() {
  return request({
    url: '/real_reports/all',
    method: 'get'
  })
}

//刷新数据
export function updateData() {
  return request({
    url: '/real_reports/refresh',
    method: 'get',
    data
  })
}

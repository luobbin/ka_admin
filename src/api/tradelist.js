import request from '@/utils/requestTrade'

export function getList(params) {
  return request({
    url: '/tradelist',
    method: 'get',
    params
  })
}

//添加数据
export function createData(data) {
  return request({
    url: '/tradelist',
    method: 'post',
    data
  })
}

//修改数据
export function editData(params,id) {
  return request({
    url: '/tradelist/'+id+'/edit',
    method: 'get',
    params
  })
}

//更新数据
export function updateData(params,ids) {
  return request({
    url: '/tradelist/'+ids,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/tradelist/'+ids,
    method: 'delete'
  })
}

//历史订单查询
export function getBakList(params,month) {
  return request({
    url: '/tradelist/bak/'+month,
    method: 'get',
    params
  })
}

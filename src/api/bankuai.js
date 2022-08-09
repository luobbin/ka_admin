import request from '@/utils/requestTrade'

export function getList(params) {
  return request({
    url: '/bankuai',
    method: 'get',
    params
  })
}

//获取淘宝系统分类
export function getTaoCates(params) {
  return request({
    url: '/bankuai/create',
    method: 'get',
    params
  })
}

export function fetchData(id) {
  return request({
    url: '/bankuai/'+id,
    method: 'get'
  })
}


export function createData(data) {
  return request({
    url: '/bankuai',
    method: 'post',
    data
  })
}

//更新数据
export function updateData(params,ids) {
  return request({
    url: '/bankuai/'+ids,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/bankuai/'+ids,
    method: 'delete'
  })
}
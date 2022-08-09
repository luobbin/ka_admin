import request from '@/utils/requestOther'

export function getList(params) {
  return request({
    url: '/share_sales',
    method: 'get',
    params
  })
}

export function fetchData(id) {
  return request({
    url: '/share_sales/'+id,
    method: 'get'
  })
}

export function createData(data) {
  return request({
    url: '/share_sales',
    method: 'post',
    data
  })
}


//更新数据
export function updateData(params,ids) {
  return request({
    url: '/share_sales/'+ids,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/share_sales/'+ids,
    method: 'delete'
  })
}

//获取用户列表
export function getUserList() {
  const params = {
    page: 1,
    limit: 50,
    filter: 'id;name;img',
    orderBy: 'id',
    sortedBy: 'desc'
  }
  return request({
    url: '/share_user',
    method: 'get',
    params
  })
}

//添加用户
export function createUser(data) {
  return request({
    url: '/share_user',
    method: 'post',
    data
  })
}
//彻底删除数据
export function deleteUser(ids) {
  return request({
    url: '/share_user/'+ids,
    method: 'delete'
  })
}
//获取第三方商品数据
export function fetchOpenData(type,id) {
  const params = {
    type: type,
    iid: id
  }
  return request({
    url: '/share_goodsinfo',
    method: 'get',
    params
  })
}
//推送消息
export function sendJpush() {
  return request({
    url: '/jpush',
    method: 'get'
  })
}
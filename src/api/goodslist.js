import request from '@/utils/requestTrade'

export function getList(params) {
  return request({
    url: '/goods',
    method: 'get',
    params
  })
}

//获取所有板块
export function getBankuais() {
  const params = {
    page: 1,
    limit: 50,
    searchJoin: 'and',
    search: 'del:0',
    searchFields: 'del:=',
    filter: 'id;title;code'
  }
  return request({
    url: '/bankuai',
    method: 'get',
    params
  })
}

//获取所有分类
export function getTypes() {
  const params = {
    page: 1,
    limit: 50,
    filter: 'id;title;tag',
    searchJoin: 'and',
    search: 'tag:goods',
    searchFields: 'tag:=',
    orderBy: 'sort',
    sortedBy: 'asc'
  }
  return request({
    url: '/type',
    method: 'get',
    params
  })
}


export function fetchData(id) {
  return request({
    url: '/goods/'+id,
    method: 'get'
  })
}


export function createData(data) {
  return request({
    url: '/goods',
    method: 'post',
    data
  })
}

//更新数据
export function updateData(params,ids) {
  return request({
    url: '/goods/'+ids,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/goods/'+ids,
    method: 'delete'
  })
}

//彻底删除过期数据
export function deleteBypast() {
  return request({
    url: '/goods/del_bypast'
  })
}
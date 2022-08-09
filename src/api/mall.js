import request from '@/utils/requestOther'

//获取列表数据
export function getList(params) {
  return request({
    url: '/malls',
    method: 'get',
    params
  })
}

//获取所有商城分类
export function getTypes() {
  const params = {
    page: 1,
    limit: 50,
    searchJoin: 'and',
    search: 'tag:mall',
    searchFields: 'tag:=',
    filter: 'id;title'
  }
  return request({
    url: '/types',
    method: 'get',
    params
  })
}

export function createData(data) {
  return request({
    url: '/malls',
    method: 'post',
    data
  })
}

//更新数据
export function updateData(params,ids) {
  return request({
    url: '/malls/'+ids,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/malls/'+ids,
    method: 'delete'
  })
}
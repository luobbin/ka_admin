import request from '@/utils/request'

export function getList(params){
    return  request({
        url: '/users',
        method: 'get',
        params
      })
}
//获取数据
export function fetchData(id) {
  return request({
    url: '/users/'+id,
    method: 'get'
  })
}
//添加数据
export function createData(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}


//更新数据
export function updateData(params,ids) {
  return request({
    url: '/users/'+ids,
    method: 'put',
    params
  })
}

//彻底删除数据
export function deleteData(ids) {
  return request({
    url: '/users/'+ids,
    method: 'delete'
  })
}

//删除数据到回收站
export function delData(id) {
  return request({
    url: '/users/'+id+'/edit',
    method: 'get'
  })
}

//获取合并有效会员
export function getYouxiao(id) {
  return request({
    url: 'https://member.xfz178.com/web/v1/sync_youxiao/'+id+'?sign=ebNE@aBXD4a$8r$*',
    method: 'get'
  })
}
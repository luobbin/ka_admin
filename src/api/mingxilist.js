import request from '@/utils/request'

export function getList(params){
    return  request({
        url: '/mingxis',
        method: 'get',
        params
      })
}

//获取所有事件
export function getShijians(){
    return  request({
        url: '/mingxis/create',
        method: 'get'
      })
}

//根据用户名获取用户id
export function getUserId(name){
    return  request({
        url: '/mingxis/'+name+'/edit',
        method: 'get'
      })
}


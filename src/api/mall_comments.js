import request from '@/utils/request'

export function fetchMallCommentList(params){
    return  request({
        url: '/mall_comments',
        method: 'get',
        params
      })
}

export function fetchDelmalldata(mallid){
    return  request({
        url: '/mall_comments/'+ mallid,
        method: 'DELETE'
      })
}

export function fetchXialadata(){
    return  request({
        url: '/mall_comments/create',
        method: 'GET'
      })
}

export function fetchAddmalldata(formdatd){
    return  request({
        url: '/mall_comments',
        method: 'POST',
        data: {
            "mall_id": formdatd.mall_id,
            "ddusername": formdatd.ddusername,
            "addtime":Number(new Date().getTime()) / 1000,
            "content": formdatd.content
        },
      })
}
